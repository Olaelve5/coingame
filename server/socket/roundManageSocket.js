import { Game } from "../models/Game.ts";
import { handleRoundEnd } from "../utils/roundUtils.js";

const roundManageSocketHandler = (io, botManager) => {
  // Handle change game status
  io.on("connection", (socket) => {
    // Prepare round handler --------------------------------------------------------------------------------------------->
    socket.on("prepareRound", async (gameCode, callback) => {
      try {
        // First check the current game status
        const currentGame = await Game.findOne({ gameCode });

        if (!currentGame) {
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

        // For first round (game starting)
        if (currentGame.status === "waiting") {
          update.$set.status = "playing";
          update.$set.round = 1;
        }
        // For subsequent rounds
        else if (currentGame.status === "playing") {
          update.$inc = { round: 1 };
        }

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
