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
            $inc: {
              "players.$.coins": -coins,
            },
            $set: {
              "players.$.playedInRound": true,
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

        console.log(
          `Updated coins for player ${playerId}:`,
          updatedGame.players.find((p) => p.id === playerId)?.coins
        );

        // Emit the updated game state to all players in the room
        io.to(gameCode).emit("gameUpdate", updatedGame);
        socket.emit("gameUpdate", updatedGame);

        // Emit the coins played event to all players in the room
        io.to(gameCode).emit("coinsPlayed", {
          playerId,
          coinsPlayed: coins,
          remainingCoins: updatedGame.players.find((p) => p.id === playerId)
            ?.coins,
        });
      } catch (error) {
        console.error("Error playing coins:", error);
        socket.emit("error", "Failed to play coins");
      }
    });
  });
};

export { gameplaySocketHandler };
