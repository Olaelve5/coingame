import { Game } from "../models/Game.ts";

const connectionSocketHandler = (io) => {
  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle player joining the game ------------------------------------------------------------------------
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
          // Change this later
          if (game.players.length >= 30) {
            return socket.emit("error", "Game is full");
          }

          if (game.status !== "waiting") {
            console.log("Game has already started");
            return socket.emit("error", "Game has already started");
          }

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
                  eliminated: false,
                  playedInRound: false,
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
                "players.$.name": playerName,
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

    // Handle host joining the game ------------------------------------------------------------------------
    socket.on("joinRoomAsHost", async (gameCode, hostId, callback) => {
      try {
        console.log(`Host joining room ${gameCode}`);
        socket.join(gameCode);

        // Fetch the game from the database
        const game = await Game.findOne({ gameCode });

        if (!game || game.host.id !== hostId) {
          return callback(null); // Return null to indicate an error
        }

        // Update the host's socket ID
        const updatedGame = await Game.findOneAndUpdate(
          { gameCode },
          {
            $set: {
              "host.socketId": socket.id,
            },
          },
          { new: true }
        );

        // Return the game state to the frontend
        callback(updatedGame);
      } catch (error) {
        console.error("Error fetching game state for host:", error);
        callback(null); // Return null if an error occurs
      }
    });

    // handle disconnect of a player ------------------------------------------------------------------------
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      try {
        // Find the game the player *might* be in.
        const game = await Game.findOne({ "players.socketId": socket.id });

        if (game) {
          // Find the player within the game.
          const player = game.players.find((p) => p.socketId === socket.id);

          if (player) {
            // Check if player was actually found
            // Update connected status AND remove socketId
            await Game.updateOne(
              { "players.socketId": socket.id },
              {
                $set: {
                  "players.$.connected": false,
                  "players.$.socketId": null, // Clear the socketId
                },
              }
            );
            // Get the updated game state
            const updatedGame = await Game.findOne({ "players.id": player.id });

            // Notify other players (use io.to for room-wide broadcast).
            io.to(game.gameCode).emit("playersUpdate", updatedGame.players);

            console.log(
              `User with socket ID ${socket.id} disconnected from game ${game.gameCode}.`
            );
          } else {
            console.log(
              `User with socket ID ${socket.id} disconnected, but was not found in any game.`
            );
          }
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });

    // Handle player kicked from the game ------------------------------------------------------------------------
    socket.on("kickPlayer", async (gameCode, playerIdToKick, callback) => {
      try {
        // Find the game and validate using host.socketId instead of players.socketId
        const game = await Game.findOne({
          gameCode,
          "host.socketId": socket.id,
        });

        if (!game) {
          return callback({
            success: false,
            message: "Game not found or you are not authorized.",
          });
        }

        // Check if the player to kick exists
        const playerToKick = game.players.find((p) => p.id === playerIdToKick);
        if (!playerToKick) {
          return callback({
            success: false,
            message: "Player to kick not found in this game.",
          });
        }

        // Update game with player removed
        const updatedGame = await Game.findOneAndUpdate(
          { gameCode },
          { $pull: { players: { id: playerIdToKick } } },
          { new: true }
        );

        // Handle socket disconnect for kicked player
        if (playerToKick.socketId) {
          const kickedSocket = io.sockets.sockets.get(playerToKick.socketId);
          if (kickedSocket) {
            kickedSocket.emit("kicked", "You have been kicked from the game.");
            kickedSocket.disconnect(true);
          }
        }

        // Notify remaining players
        io.to(gameCode).emit("playersUpdate", updatedGame.players);
        console.log(`Player ${playerIdToKick} was kicked from ${gameCode}`);

        return callback({
          success: true,
          message: "Player kicked successfully.",
        });
      } catch (error) {
        console.error("Error kicking player:", error);
        return callback({
          success: false,
          message: "An error occurred while kicking the player.",
        });
      }
    });
  });
};

export { connectionSocketHandler };
