import { Game } from "../models/Game.ts";

const roundManageSocketHandler = (io) => {
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

        if (callback) callback({ success: true, game: updatedGame });
      } catch (error) {
        console.error("Error starting next round:", error);
        if (callback) callback({ error: "Failed to start next round" });
      }
    });
  });
};

export { roundManageSocketHandler };
