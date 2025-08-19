function getIDsForTimeAwards(game) {
  if (!game || !game.players || game.players.length === 0) return [];

  let quickestPlayer = {};
  let slowestPlayer = {};

  for (const player of game.players) {
    const averageTimeSpent =
      player.roundHistory.reduce((sum, round) => sum + round.timeSpent, 0) /
        player.roundHistory.length || 0;

    if (
      !quickestPlayer.id ||
      averageTimeSpent < quickestPlayer.averageTimeSpent
    ) {
      quickestPlayer = {
        id: player.id,
        averageTimeSpent,
      };
    } else if (
      !slowestPlayer.id ||
      averageTimeSpent > slowestPlayer.averageTimeSpent
    ) {
      slowestPlayer = {
        id: player.id,
        averageTimeSpent,
      };
    }
  }

  return [
    {
      playerID: quickestPlayer.id,
      awardID: "quick_draw",
      insight: `Lightning fast decisions! Average thinking time: ${(
        quickestPlayer.averageTimeSpent / 1000
      ).toFixed(1)}s`,
    },
    {
      playerID: slowestPlayer.id,
      awardID: "mastermind",
      insight: `Calculated every move carefully. Average thinking time: ${(
        slowestPlayer.averageTimeSpent / 1000
      ).toFixed(1)}s`,
    },
  ];
}

function getHighRollerAndCliffhangerAward(game) {
  if (!game || !game.players || game.players.length === 0) return [];

  let highRoller = {};
  let cliffhanger = {};

  for (const player of game.players) {
    const biggestBet = player.roundHistory.reduce(
      (max, round) => Math.max(max, round.coinsPlayed || 0),
      0
    );

    if (!highRoller.id || biggestBet > highRoller.biggestBet) {
      highRoller = {
        id: player.id,
        biggestBet,
      };
    }

    const numberOfCloseCalls = player.roundHistory.reduce(
      (count, round) => (round.closeCall ? count + 1 : count),
      0
    );

    if (
      !cliffhanger.id ||
      numberOfCloseCalls > cliffhanger.numberOfCloseCalls
    ) {
      cliffhanger = {
        id: player.id,
        numberOfCloseCalls,
      };
    }
  }

  const awards = [];

  if (highRoller.id) {
    awards.push({
      playerID: highRoller.id,
      awardID: "high_roller",
      insight: `High stakes legend! Made the biggest single bet of ${highRoller.biggestBet} coins`,
    });
  }

  if (cliffhanger.id && cliffhanger.numberOfCloseCalls > 0) {
    awards.push({
      playerID: cliffhanger.id,
      awardID: "cliffhanger",
      insight: `Master of precision! Threaded the needle with ${cliffhanger.numberOfCloseCalls} close calls`,
    });
  }

  return awards;
}

function getSteadyHandAward(game) {
  if (!game || !game.players || game.players.length === 0) return [];

  let steadyHand = {};

  for (const player of game.players) {
    if (player.roundHistory.length < 2) continue;

    const biggestBet = player.roundHistory.reduce(
      (max, round) => Math.max(max, round.coinsPlayed || 0),
      0
    );

    const smallestBet = player.roundHistory.reduce(
      (min, round) => Math.min(min, round.coinsPlayed || Infinity),
      Infinity
    );

    if (
      !steadyHand.id ||
      biggestBet - smallestBet < steadyHand.biggestBet - steadyHand.smallestBet
    ) {
      steadyHand = {
        id: player.id,
        biggestBet,
        smallestBet,
      };
    }
  }

  if (!steadyHand.id) return [];

  return [
    {
      playerID: steadyHand.id,
      awardID: "steady_hand",
      insight: `Master of consistency! Kept bets within a tight ${
        steadyHand.biggestBet - steadyHand.smallestBet
      } coin range`,
    },
  ];
}

export function getAllAwards(game) {
  const timeAwards = getIDsForTimeAwards(game);
  const highRollerAndCliffhangerAward = getHighRollerAndCliffhangerAward(game);
  const steadyHandAward = getSteadyHandAward(game);

  return [...timeAwards, ...highRollerAndCliffhangerAward, ...steadyHandAward];
}
