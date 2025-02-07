import { Game } from "../models/Game.ts";

const connectionSocketHandler = (io) => {
  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinGame", async (gameCode, playerName, playerId) => {
      try {
        // First, try to find the game
        let game = await Game.findOne({ gameCode });
        if (!game) {
          // Game not found: handle appropriately (maybe emit an error)
          return socket.emit("error", "Game not found");
        }

        // Check if player already exists
        const playerExists = game.players?.some((p) => p.id === playerId);

        if (!playerExists) {
          // If player doesn't exist, add them to the game
          game = await Game.findOneAndUpdate(
            { gameCode, "players.id": { $ne: playerId } },
            {
              $addToSet: {
                players: {
                  id: playerId,
                  name: playerName,
                  coins: 100,
                  connected: true,
                  socketId: socket.id,
                },
              },
            },
            { new: true, upsert: false }
          );
        } else {
          // Update the player's socket id if needed:
          game = await Game.findOneAndUpdate(
            { gameCode, "players.id": playerId },
            {
              $set: {
                "players.$.socketId": socket.id,
                "players.$.connected": true,
              },
            },
            { new: true, upsert: false }
          );

          console.log(`Player ${playerId} is reconnecting to ${gameCode}`);
        }

        // Ensure the socket joins the room
        socket.join(gameCode);
        console.log(`Player ${playerName} (${playerId}) joined ${gameCode}`);

        // Re-fetch the game to ensure we have the latest state
        game = await Game.findOne({ gameCode });
        if (!game) {
          return socket.emit("error", "Failed to retrieve game state");
        }

        // Emit game state back to the client
        socket.emit("gameUpdate", game);

        // Broadcast to others that a (re)join occurred, if needed
        socket.to(gameCode).emit("playersUpdate", game.players);
      } catch (error) {
        console.error("Join game error:", error);
        socket.emit("error", "Failed to join game");
      }
    });

    // Handle host joining the game
    socket.on("joinRoomAsHost", async (gameCode, hostId, callback) => {
      try {
        console.log(`Host joining room ${gameCode}`);
        socket.join(gameCode);

        // Fetch the game from the database
        const game = await Game.findOne({ gameCode });

        if (!game || game.hostId !== hostId) {
          return callback(null); // Return null to indicate an error
        }

        // Return the game state to the frontend
        callback(game);
      } catch (error) {
        console.error("Error fetching game state for host:", error);
        callback(null); // Return null if an error occurs
      }
    });

    // handle disconnect of a player
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      // Update the player's connected status in the game
      try {
        const game = await Game.findOneAndUpdate(
          { "players.socketId": socket.id },
          { $set: { "players.$.connected": false } },
          { new: true }
        );

        if (game) {
          console.log(`User with socket ID ${socket.id} disconnected.`);
          socket.emit("gameUpdate", game);
          socket.to(game.gameCode).emit("playersUpdate", game.players);
        }
      } catch (error) {
        console.error("Error updating player status on disconnect:", error);
      }
    });
  });
};

export { connectionSocketHandler };
