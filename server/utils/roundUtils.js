import { Game } from "../models/Game.ts";
import { calculateRoundResults } from "../utils/gameUtils.js";
import { getAllAwards } from "./awardUtils.js";


export const handleRoundEnd = async (gameCode) => {
  console.log(`Ending round for game ${gameCode}`);
  const game = await Game.findOne({ gameCode });
  if (!game) throw new Error("Game not found");

  const roundResults = calculateRoundResults(game);

  // Add close call to players
  if (
    roundResults.playersWithCloseCall &&
    roundResults.playersWithCloseCall.length > 0
  ) {
    const closeCallPlayerIds = roundResults.playersWithCloseCall.map(
      (p) => p.id
    );

    await Game.updateOne(
      { gameCode },
      {
        $set: {
          "players.$[player].roundHistory.$[round].closeCall": true,
        },
      },
      {
        arrayFilters: [
          { "player.id": { $in: closeCallPlayerIds } },
          { "round.round": game.round },
        ],
      }
    );
  }

  if (roundResults.wasFinalRound) {
    // Final round: Store results and execute eliminations immediately
    await Game.findOneAndUpdate(
      { gameCode },
      {
        $set: {
          lastRoundResults: roundResults,
        },
        $push: {
          rounds: roundResults,
        },
      },
      { new: true }
    );

    console.log("Final round detected, executing eliminations");
    return executeEliminations(gameCode);
  }

  // Regular round: Store results and set eliminating status
  const updatedGame = await Game.findOneAndUpdate(
    { gameCode },
    {
      $set: {
        roundStatus: "eliminating",
        lastRoundResults: roundResults,
      },
      $push: {
        rounds: roundResults,
      },
    },
    { new: true }
  );

  return updatedGame;
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

  if (isGameOver && remainingPlayers.length === 1) {
    updateOperations.push({
      updateOne: {
        filter: { gameCode, "players.id": remainingPlayers[0].id },
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
    const freshGame = await Game.findOne({ gameCode });
    const awards = getAllAwards(freshGame);

    const awardUpdates = awards.map((awardObject) => ({
      updateOne: {
        filter: { gameCode, "players.id": awardObject.playerID },
        update: {
          $push: {
            "players.$.awards": {
              id: awardObject.awardID,
              insight: awardObject.insight,
            },
          },
        },
      },
    }));

    if (awardUpdates.length > 0) {
      await Game.bulkWrite(awardUpdates);
    }

    return Game.findOneAndUpdate(
      { gameCode },
      {
        $set: {
          status: "finished",
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

  // Sort by coins betted descending, then by total coins
  playersEliminated.sort((a, b) => {
    const lastBetDiff =
      b.roundHistory[b.roundHistory.length - 1].coinsPlayed -
      a.roundHistory[a.roundHistory.length - 1].coinsPlayed;

    const totalCoinsDiff = b.coins - a.coins;

    return lastBetDiff || totalCoinsDiff;
  });

  let currentRank = aliveCount + 1; // Start from the first elimination rank
  let prevBet = null;
  let prevCoins = null;

  playersEliminated.forEach((player, index) => {
    const playerBet = player.roundHistory[player.roundHistory.length - 1].coinsPlayed;

    // If coins are different from previous player, update rank
    if (playerBet !== prevBet || player.coins !== prevCoins) {
      currentRank = aliveCount + 1 + index;
    }

    player.endRank = currentRank;
    prevCoins = player.coins;
    prevBet = playerBet;

    console.log(
      `Player ${player.name} (${player.coins} coins) assigned rank ${currentRank}`
    );
  });

  return playersEliminated;
};
