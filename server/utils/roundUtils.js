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
        lastRoundResults: roundResults,
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

  let prevCoins = null;
  let prevRank = aliveCount;
  let playersWithPrevRank = 0;

  playersEliminated.forEach((player) => {
    // New rank
    if (player.coins !== prevCoins) {
      console.log(
        `Player ${player.name} has ${
          player.coins
        } coins, previous was ${prevCoins}. Assigning new rank ${
          prevRank + 1 + playersWithPrevRank
        }`
      );

      prevCoins = player.coins;
      const playerRank = prevRank + 1 + playersWithPrevRank;
      player.endRank = playerRank;
      prevRank = playerRank;

      // Same rank
    } else {
      console.log(
        `Player ${player.name} has same coins as previous (${prevCoins}). Assigning rank ${prevRank}`
      );

      player.endRank = prevRank;
      // Only count excess players with same amount of coins
      playersWithPrevRank++;
    }
  });

  return playersEliminated;
};
