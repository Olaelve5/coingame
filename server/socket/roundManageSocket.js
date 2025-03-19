import { Game } from "../models/Game.ts";
import { handleRoundEnd } from "../utils/roundUtils.js";

const roundManageSocketHandler = (io, botManager) => {
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
              round: 1, // Start from round 1
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

        // Trigger bot plays after a short delay
        setTimeout(() => {
          botManager.handleGameUpdate(game);
        }, 2000); // Give players a couple seconds to see the round started

        if (callback) callback({ success: true, game });
      } catch (error) {
        console.error("Error changing game status:", error);
        if (callback) callback({ error: "Failed to start game" });
      }
    });

    // Handle prepare next round handler --------------------------------------------------------------------------------------------->@
    socket.on("prepareNextRound", async (gameCode, callback) => {
      try {
        const game = await Game.findOneAndUpdate(
          { gameCode },
          { $set: { roundStatus: "preparing" } },
          { new: true }
        );

        io.to(gameCode).emit("gameUpdate", game);
        if (callback) callback({ success: true });
      } catch (error) {
        console.error("Error preparing round:", error);
        if (callback) callback({ error: "Failed to prepare round" });
      }
    });

    // Handle start next round --------------------------------------------------------------------------------------------->
    socket.on("startNextRound", async (gameCode, callback) => {
      try {
        const currentGame = await Game.findOne({ gameCode });

        if (!currentGame || currentGame.roundStatus !== "completed") {
          if (callback) callback({ error: "Cannot start next round" });
          return;
        }

        const updatedGame = await Game.findOneAndUpdate(
          { gameCode },
          {
            $inc: { round: 1 }, // Changed from currentRound to round
            $set: {
              roundStatus: "active",
              "players.$[].playedInRound": false,
            },
          },
          { new: true }
        );

        io.to(gameCode).emit("roundStarted", {
          roundNumber: updatedGame.round,
        });
        io.to(gameCode).emit("gameUpdate", updatedGame);

        // Trigger bot plays after a short delay
        setTimeout(() => {
          botManager.handleGameUpdate(updatedGame);
        }, 2000);

        if (callback) callback({ success: true, game: updatedGame });
      } catch (error) {
        console.error("Error starting next round:", error);
        if (callback) callback({ error: "Failed to start next round" });
      }
    });

    // Handle end round --------------------------------------------------------------------------------------------->
    // Players who are not eliminated and have not played in the round
    // will play 0 coins and be marked as played in the round
    socket.on("endRound", async (gameCode, callback) => {
      try {
        const game = await Game.findOne({ gameCode });

        if (!game) {
          console.error(`Game with code ${gameCode} not found`);
          if (callback) callback({ error: "Game not found" });
          return;
        }

        const notPlayedPlayers = game.players.filter(
          (player) => !player.playedInRound && !player.eliminated
        );

        // Set default plays for these players (0 coins)
        const playerUpdates = notPlayedPlayers.map((player) => ({
          updateOne: {
            filter: {
              gameCode,
              "players._id": player._id,
            },
            update: {
              $set: {
                "players.$.playedInRound": true,
                "players.$.coinsPlayed": 0, // Default to playing 0 coins
              },
            },
          },
        }));

        // Execute all the player updates if there are any
        if (playerUpdates.length > 0) {
          await Game.bulkWrite(playerUpdates);
        }

        // Handle round end logic
        const updatedGame = await handleRoundEnd(gameCode, game);

        if (!updatedGame) {
          console.error(`Failed to update game ${gameCode}`);
          if (callback) callback({ error: "Failed to end round" });
          return;
        }

        // Emit the game update event
        io.to(gameCode).emit("gameUpdate", updatedGame);
        if (callback) callback({ success: true, game: updatedGame });
      } catch (error) {
        console.error("Error ending round:", error);
        if (callback) callback({ error: "Failed to end round" });
      }
    });
  });
};

export { roundManageSocketHandler };
