import { Game } from "../models/Game.ts";
import { calculateRoundResults } from "../utils/gameUtils.js";

export const handleRoundEnd = async (gameCode) => {
  console.log(`Ending round for game ${gameCode}`);
  const game = await Game.findOne({ gameCode });
  if (!game) throw new Error("Game not found");

  const roundResults = calculateRoundResults(game);

  // Store results but dont update game status yet
  return Game.findOneAndUpdate(
    { gameCode },
    {
      $set: {
        roundStatus: "eliminating", // Show elimination report
      },
      $push: {
        rounds: roundResults,
      },
    },
    { new: true }
  );
};

export const executeEliminations = async (gameCode) => {
  const game = await Game.findOne({ gameCode });
  if (!game || !game.lastRoundResults) throw new Error("Game not found");

  const playersEliminated = game.lastRoundResults.playersEliminated;
  const playersEliminatedObjects = game.players.filter((p) =>
    playersEliminated.some((el) => el.id === p.id)
  );
  const playersWithRanks = getPlayerRanks(game, playersEliminatedObjects);

  // Count and find active players after elimination
  const remainingPlayers = game.players.filter(
    (p) =>
      !p.eliminated &&
      !playersEliminated.find((eliminated) => eliminated.id === p.id)
  );

  const isGameOver = remainingPlayers.length <= 1;
  const winner = isGameOver ? remainingPlayers[0] : null;

  const updateOperations = playersWithRanks.map((player) => ({
    updateOne: {
      filter: { gameCode, "players.id": player.id },
      update: {
        $set: {
          "players.$.eliminated": true,
          "players.$.endRank": player.endRank,
        },
      },
    },
  }));

  if (isGameOver && winner) {
    updateOperations.push({
      updateOne: {
        filter: { gameCode, "players.id": winner.id },
        update: {
          $set: {
            "players.$.endRank": 1,
          },
        },
      },
    });
  }

  // Apply all updates in one go
  await Game.bulkWrite(updateOperations);

  if (isGameOver) {
    return Game.findOneAndUpdate(
      { gameCode },
      {
        $set: {
          status: "finished",
          winner: {
            id: winner.id,
            name: winner.name,
            coins: winner.coins,
            roundHistory: winner.roundHistory,
          },
        },
      },
      { new: true }
    );
  }

  return Game.findOne({ gameCode });
};

const getPlayerRanks = (game, playersEliminated) => {
  if (playersEliminated.length === 0) {
    throw new Error("No players eliminated");
  }

  const prevEliminatedPlayers = game.players.filter(
    (player) => player.eliminated
  );

  const aliveCount =
    game.players.length -
    prevEliminatedPlayers.length -
    playersEliminated.length;

  // Sort by coins descending (highest coins get better rank)
  playersEliminated.sort((a, b) => b.coins - a.coins);

  let currentRank = aliveCount + 1; // Start from the first elimination rank
  let prevCoins = null;

  playersEliminated.forEach((player, index) => {
    // If coins are different from previous player, update rank
    if (player.coins !== prevCoins) {
      currentRank = aliveCount + 1 + index;
    }

    player.endRank = currentRank;
    prevCoins = player.coins;

    console.log(
      `Player ${player.name} (${player.coins} coins) assigned rank ${currentRank}`
    );
  });

  return playersEliminated;
};
