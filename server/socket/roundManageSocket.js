import { Game } from "../models/Game.ts";
import { handleRoundEnd, executeEliminations } from "../utils/roundUtils.js";
import validateGameSettings from "../utils/validateGameSettings.js";

const roundManageSocketHandler = (io, botManager) => {
  // Handle change game status
  io.on("connection", (socket) => {
    // Start game handler ----------------------------------------------------------------------------------->
    socket.on("startGame", async (gameCode, gameSettings, callback) => {
      try {
        const currentGame = await Game.findOne({ gameCode });

        if (!currentGame || currentGame.status !== "waiting") {
          if (callback) callback({ error: "Cannot start game" });
          return;
        }

        const { valid, errors } = validateGameSettings(
          gameSettings,
          currentGame.players.length
        );

        if (!valid) {
          console.error("Invalid game settings:", errors);
          callback({ error: "Invalid game settings", details: errors });
          return;
        }

        // Set player initial budget based on the gamesettings
        // and the number of players
        let initialCoinsAmount = 100;
        if (gameSettings.initialCoins) {
          const initialCoins = {
            low: Math.max(50, 5 * currentGame.players.length),
            medium: Math.max(100, 10 * currentGame.players.length),
            high: Math.max(200, 20 * currentGame.players.length),
          };
          initialCoinsAmount = initialCoins[gameSettings.initialCoins];
        }

        const update = {
          $set: {
            round: 1,
            roundStatus: "preparing",
            "players.$[].playedInRound": false,
            "players.$[].coins": initialCoinsAmount,
            gameSettings: {
              initialCoins: gameSettings.initialCoins,
              fastMode: gameSettings.fastMode,
              roundTimeLimit: gameSettings.roundTimeLimit,
              elimsPerRound: gameSettings.elimsPerRound,
            },
          },
        };

        const updatedGame = await Game.findOneAndUpdate({ gameCode }, update, {
          new: true,
        });

        console.log(`Started game ${gameCode} with settings:`, gameSettings);
        io.to(gameCode).emit("gameUpdate", updatedGame);

        if (callback) callback({ success: true, game: updatedGame });
      } catch (error) {
        console.error("Error starting game:", error);
        if (callback) callback({ error: "Failed to start game" });
      }
    });

    socket.on("beginGameplay", async (gameCode, callback) => {
      try {
        const updatedGame = await Game.findOneAndUpdate(
          { gameCode },
          { $set: { status: "playing" } },
          { new: true }
        );

        io.to(gameCode).emit("gameUpdate", updatedGame);
        if (callback) callback({ success: true, game: updatedGame });
      } catch (error) {
        console.error("Error beginning gameplay:", error);
        if (callback) callback({ error: "Failed to begin gameplay" });
      }
    });

    // Prepare round handler --------------------------------------------------------------------------------------------->
    socket.on("prepareRound", async (gameCode, callback) => {
      try {
        // First check the current game status
        const currentGame = await Game.findOne({ gameCode });

        if (!currentGame || currentGame.status !== "playing") {
          if (callback) callback({ error: "Game not found" });
          return;
        }

        // Different update logic depending on whether this is the first round or not
        const update = {
          $set: {
            roundStatus: "preparing",
            "players.$[].playedInRound": false,
          },
        };

        const game = await Game.findOneAndUpdate({ gameCode }, update, {
          new: true,
        });

        console.log(`Prepared round ${game.round} for game ${gameCode}`);
        io.to(gameCode).emit("gameUpdate", game);

        if (callback) callback({ success: true, game });
      } catch (error) {
        console.error("Error preparing round:", error);
        if (callback) callback({ error: "Failed to prepare round" });
      }
    });

    // Handle start next round --------------------------------------------------------------------------------------------->
    socket.on("startNextRound", async (gameCode, callback) => {
      try {
        const currentGame = await Game.findOne({ gameCode });

        // If roundstatus is eliminating, we eliminated players
        if (currentGame.roundStatus === "eliminating") {
          console.log(`Executing eliminations for game ${gameCode}`);

          const gameAfterElimination = await executeEliminations(gameCode);

          // Check if game is finished
          if (gameAfterElimination.status === "finished") {
            io.to(gameCode).emit("gameUpdate", gameAfterElimination);
            if (callback)
              callback({
                success: true,
                game: gameAfterElimination,
                gameFinished: true,
              });
            return;
          }

          // Game continues - prepare for next round
          const nextRoundGame = await Game.findOneAndUpdate(
            { gameCode },
            {
              $set: {
                roundStatus: "preparing",
                "players.$[].playedInRound": false,
              },
              $inc: { round: 1 },
            },
            { new: true }
          );

          console.log(
            `Prepared next round ${nextRoundGame.round} for game ${gameCode}`
          );
          io.to(gameCode).emit("gameUpdate", nextRoundGame);
          if (callback) callback({ success: true, game: nextRoundGame });
          return;
        }

        if (!currentGame || currentGame.roundStatus !== "preparing") {
          if (callback) callback({ error: "Cannot start next round" });
          return;
        }

        const updatedGame = await Game.findOneAndUpdate(
          { gameCode },
          {
            $set: {
              roundStatus: "active",
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

    // Finalize round plays --------------------------------------------------------------------------------------------->
    socket.on("finalizeRoundPlays", async (gameCode, callback) => {
      try {
        const game = await Game.findOne({ gameCode });

        // Make non-played players play 0 coins
        const notPlayedPlayers = game.players.filter(
          (player) => !player.playedInRound && !player.eliminated
        );

        if (notPlayedPlayers.length === 0) {
          console.log("All players have played in this round.");
          if (callback) callback({ success: true, game });
          return;
        }

        // Update these players to have played 0 coins
        const playerUpdates = notPlayedPlayers.map((player) => ({
          updateOne: {
            filter: { gameCode, "players._id": player._id },
            update: {
              $set: {
                "players.$.playedInRound": true,
                "players.$.roundHistory": [
                  ...player.roundHistory,
                  { round: game.round, coinsPlayed: 0 },
                ],
              },
            },
          },
        }));

        if (playerUpdates.length > 0) {
          await Game.bulkWrite(playerUpdates);
        }

        const updatedGame = await Game.findOne({ gameCode });
        io.to(gameCode).emit("gameUpdate", updatedGame);

        if (callback) callback({ success: true, game: updatedGame });
      } catch (error) {
        console.error("Error finalizing round plays:", error);
        if (callback) callback({ error: "Failed to finalize round plays" });
      }
    });

    // Handle end round - eliminate players --------------------------------------------------------------------------------------------->
    socket.on("endRound", async (gameCode, callback) => {
      try {
        // Handle round end logic
        const updatedGame = await handleRoundEnd(gameCode);

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
