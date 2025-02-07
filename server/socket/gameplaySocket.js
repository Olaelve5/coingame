import { Game } from "../models/Game.ts";

const gameplaySocketHandler = (io) => {
  // Handle change game status
  io.on("connection", (socket) => {
    // Start game handler
    socket.on("startGame", async (gameCode, callback) => {
      try {
        console.log(`Starting game: ${gameCode}`);
        const game = await Game.findOneAndUpdate(
          { gameCode },
          { $set: { status: "playing" } },
          { new: true }
        );

        if (!game) {
          console.error(`Game with code ${gameCode} not found`);
          if (callback) callback({ error: "Game not found" });
          return;
        }

        // Emit the updated game state to all players in the room
        socket.emit("gameUpdate", game);
        socket.to(gameCode).emit("gameUpdate", game);

        // Optionally, call the callback to confirm the status change
        if (callback) callback({ success: true, game });
      } catch (error) {
        console.error("Error changing game status:", error);
      }
    });

    // Handle play coins
    socket.on("playCoins", async (gameCode, playerId, coins) => {
      try {
        console.log(
          `Player ${playerId} playing ${coins} coins in game ${gameCode}`
        );

        // Update the player's coins in the database
        const game = await Game.findOneAndUpdate(
          {
            gameCode,
            "players.id": playerId,
            "players.coins": { $gte: coins }, // Ensure player has enough coins
          },
          {
            $inc: { "players.$.coins": -coins }, // Subtract coins from player
          },
          { new: true }
        );

        if (!game) {
          console.error(`Failed to update coins for player ${playerId}`);
          socket.emit(
            "error",
            "Failed to play coins - insufficient funds or invalid game"
          );
          return;
        }

        // Emit the updated game state to all players in the room
        io.to(gameCode).emit("gameUpdate", game);

        // Emit the coins played event to all players in the room
        io.to(gameCode).emit("coinsPlayed", {
          playerId,
          coinsPlayed: coins,
          remainingCoins: game.players.find((p) => p.id === playerId)?.coins,
        });
      } catch (error) {
        console.error("Error playing coins:", error);
        socket.emit("error", "Failed to play coins");
      }
    });
  });
};

export { gameplaySocketHandler };
