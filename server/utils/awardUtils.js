function getIDsForTimeAwards(game) {
  if (!game || !game.players || game.players.length === 0) return null;

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

export function getAllAwards(game) {
  const timeAwards = getIDsForTimeAwards(game);
  const otherAwards = []; // Populate with other awards as needed

  return [...timeAwards, ...otherAwards];
}
