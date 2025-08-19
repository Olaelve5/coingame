import { handleRoundEnd } from "../utils/roundUtils.js";
import { Game } from "../models/Game.ts";

const validatePlayCoins = async (gameCode, playerId, coins) => {
  const currentGame = await Game.findOne({ gameCode });
  if (!currentGame) {
    throw new Error("Game not found");
  }

  const player = currentGame.players.find((p) => p.id === playerId);
  if (!player || player.eliminated) {
    throw new Error("Player not found in game or is eliminated");
  }

  if (player.coins < coins || player.playedInRound) {
    throw new Error("Insufficient coins or already played");
  }

  return currentGame;
};

const updatePlayerCoins = async (gameCode, playerId, coins, currentGame) => {
  const timeSpent = Date.now() - currentGame.roundStartedAt;

  return Game.findOneAndUpdate(
    {
      gameCode,
      "players.id": playerId,
    },
    {
      $inc: { "players.$.coins": -coins },
      $set: { "players.$.playedInRound": true },
      $push: {
        "players.$.roundHistory": {
          round: currentGame.round,
          timeSpent,
          coinsPlayed: coins,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// New function to validate icon changes
const validateIconChange = async (gameCode, playerId) => {
  const currentGame = await Game.findOne({ gameCode });
  if (!currentGame) {
    throw new Error("Game not found");
  }

  const player = currentGame.players.find((p) => p.id === playerId);
  if (!player) {
    throw new Error("Player not found in game");
  }

  return currentGame;
};

// New function to update player icon and color
const updatePlayerIcon = async (gameCode, playerId, icon, color) => {
  return Game.findOneAndUpdate(
    {
      gameCode,
      "players.id": playerId,
    },
    {
      $set: {
        "players.$.icon": icon,
        "players.$.color": color,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

const gameplaySocketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("playCoins", async (gameCode, playerId, coins) => {
      try {
        const currentGame = await validatePlayCoins(gameCode, playerId, coins);

        const updatedGame = await updatePlayerCoins(
          gameCode,
          playerId,
          coins,
          currentGame
        );

        if (!updatedGame) {
          throw new Error("Failed to update coins");
        }

        const allPlayed = updatedGame.players
          .filter((p) => !p.eliminated)
          .every((p) => p.playedInRound);

        if (allPlayed) {
          const gameWithResults = await handleRoundEnd(gameCode, updatedGame);
          io.to(gameCode).emit("gameUpdate", gameWithResults);
        } else {
          io.to(gameCode).emit("gameUpdate", updatedGame);
        }
      } catch (error) {
        console.error("Error playing coins:", error);
        socket.emit("error", error.message);
      }
    });

    // Add new handler for changeIcon event
    socket.on("changeIcon", async (gameCode, playerId, icon, color) => {
      try {
        await validateIconChange(gameCode, playerId);

        const updatedGame = await updatePlayerIcon(
          gameCode,
          playerId,
          icon,
          color
        );

        if (!updatedGame) {
          throw new Error("Failed to update player icon");
        }

        io.to(gameCode).emit("gameUpdate", updatedGame);
      } catch (error) {
        console.error("Error changing icon:", error);
        socket.emit("error", error.message);
      }
    });
  });
};

export { gameplaySocketHandler };
