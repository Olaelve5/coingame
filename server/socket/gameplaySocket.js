import { Game } from "../models/Game.ts";
import { calculateRoundResults } from "../utils/gameUtils.js";

const gameplaySocketHandler = (io) => {
  // Handle change game status
  io.on("connection", (socket) => {
    // Start game handler --------------------------------------------------------------------------------------------->
    socket.on("startGame", async (gameCode, callback) => {
      try {
        console.log(`Starting game: ${gameCode}`);
        const game = await Game.findOneAndUpdate(
          { gameCode },
          {
            $set: {
              status: "playing",
              roundStatus: "active",
              round: 1,
              "players.$[].playedInRound": false, // Reset all players' played status
            },
          },
          { new: true }
        );

        if (!game) {
          console.error(`Game with code ${gameCode} not found`);
          if (callback) callback({ error: "Game not found" });
          return;
        }

        // Emit the game start and round start events
        io.to(gameCode).emit("gameUpdate", game);
        
        io.to(gameCode).emit("roundStarted", {
          roundNumber: game.round,
        });

        if (callback) callback({ success: true, game });
      } catch (error) {
        console.error("Error changing game status:", error);
        if (callback) callback({ error: "Failed to start game" });
      }
    });

    // Handle play coins --------------------------------------------------------------------------------------------->
    socket.on("playCoins", async (gameCode, playerId, coins) => {
      try {
        // First, find the game and validate player has enough coins
        const currentGame = await Game.findOne({ gameCode });

        if (!currentGame) {
          socket.emit("error", "Game not found");
          return;
        }

        const player = currentGame.players.find((p) => p.id === playerId);

        if (!player) {
          socket.emit("error", "Player not found in game");
          return;
        }

        if (player.coins < coins || player.playedInRound) {
          console.log(
            `Player ${playerId} has insufficient coins or already played`
          );
          socket.emit("error", "Insufficient coins or already played");
          return;
        }

        console.log(
          `Player ${playerId} playing ${coins} coins in game ${gameCode}`
        );

        // Update the player's coins in the database
        const updatedGame = await Game.findOneAndUpdate(
          {
            gameCode,
            "players.id": playerId, // Ensure we're targeting the correct player
          },
          {
            $inc: { "players.$.coins": -coins },
            $set: { "players.$.playedInRound": true },
            $push: {
              "players.$.roundHistory": {
                round: currentGame.round,
                coinsPlayed: coins,
              },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        if (!updatedGame) {
          console.error(`Failed to update coins for player ${playerId}`);
          socket.emit("error", "Failed to play coins");
          return;
        }

        // Check if all players have played
        const allPlayed = updatedGame.players.every((p) => p.playedInRound);

        if (allPlayed) {
          // Calculate round results and update game
          const roundResults = calculateRoundResults(updatedGame);
          const gameWithResults = await Game.findOneAndUpdate(
            { gameCode },
            {
              $set: {
                roundStatus: "completed",
                lastRoundResults: roundResults,
              },
            },
            { new: true }
          );

          // Emit round end event with results
          io.to(gameCode).emit("roundEnded", {
            roundNumber: gameWithResults.currentRound,
            results: roundResults,
          });
          io.to(gameCode).emit("gameUpdate", gameWithResults);
        } else {
          // Emit the updated game state to all players in the room
          io.to(gameCode).emit("gameUpdate", updatedGame);
          socket.emit("gameUpdate", updatedGame);
        }
      } catch (error) {
        console.error("Error playing coins:", error);
        socket.emit("error", "Failed to play coins");
      }
    });

    // Handle start next round --------------------------------------------------------------------------------------------->
    io.on("startNextRound", async (gameCode, callback) => {
      try {
        const currentGame = await Game.findOne({ gameCode });

        if (!currentGame || currentGame.roundStatus !== "completed") {
          if (callback) callback({ error: "Cannot start next round" });
          return;
        }

        const updatedGame = await Game.findOneAndUpdate(
          { gameCode },
          {
            $inc: { currentRound: 1 },
            $set: {
              roundStatus: "active",
              "players.$[].playedInRound": false, // Reset all players' played status
            },
          },
          { new: true }
        );

        io.to(gameCode).emit("roundStarted", {
          roundNumber: updatedGame.currentRound,
        });
        io.to(gameCode).emit("gameUpdate", updatedGame);

        if (callback) callback({ success: true, game: updatedGame });
      } catch (error) {
        console.error("Error starting next round:", error);
        if (callback) callback({ error: "Failed to start next round" });
      }
    });
  });
};

export { gameplaySocketHandler };
