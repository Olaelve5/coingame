import { calculateRoundResults } from "../utils/gameUtils.js";
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

const updatePlayerCoins = async (gameCode, playerId, coins, currentRound) => {
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
          round: currentRound,
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

const handleRoundEnd = async (gameCode, updatedGame) => {
  const roundResults = calculateRoundResults(updatedGame);
  const playersEliminated = roundResults.playersEliminated;

  // Count and find active players after elimination
  const remainingPlayers = updatedGame.players.filter(
    (p) =>
      !p.eliminated &&
      !playersEliminated.find((eliminated) => eliminated.id === p.id)
  );

  const isGameOver = remainingPlayers.length === 1;
  const winner = isGameOver ? remainingPlayers[0] : null;

  return Game.findOneAndUpdate(
    { gameCode },
    {
      $set: {
        roundStatus: "completed",
        lastRoundResults: roundResults,
        "players.$[elem].eliminated": true,
        ...(isGameOver && {
          status: "finished",
          winner: {
            id: winner.id,
            name: winner.name,
            coins: winner.coins,
            roundHistory: winner.roundHistory,
          },
        }),
      },
    },
    {
      new: true,
      arrayFilters: [
        { "elem.id": { $in: playersEliminated.map((p) => p.id) } },
      ],
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
          currentGame.round
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
  });
};

export { gameplaySocketHandler };
