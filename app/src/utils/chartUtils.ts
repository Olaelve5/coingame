import { Player, Game } from "@/models/Game";

// chartUtils.ts
export function getLastRoundChartData(
  players: Player[],
  currentRound: number,
  initialCoinsAmount: number
) {
  // Create dynamic intervals based on initial budget
  const intervalSize = Math.ceil(initialCoinsAmount / 1.5 / 10);
  const chartData: any = [];

  for (let i = 0; i < 10; i++) {
    const low = i * intervalSize;
    const high = Math.min((i + 1) * intervalSize, initialCoinsAmount);
    chartData.push({
      intervalLow: low,
      intervalHigh: high,
      count: 0,
      label: i === 9 ? `${low}+` : low,
    });
  }

  players.forEach((player) => {
    const lastRoundData = player.roundHistory.find((round) => round.round === currentRound);
    if (lastRoundData) {
      const coinsPlayed = lastRoundData.coinsPlayed;
      const intervalIndex = Math.min(Math.floor(coinsPlayed / intervalSize), 9);
      chartData[intervalIndex].count++;
    }
  });

  return chartData;
}

export function getRoundChartsData(game: Game, player: Player) {
  let data: {
    [key: number]: {
      round: number;
      playerCoins?: number;
      averageCoins: number;
      playerBet?: number;
    };
  } = {};

  data[0] = {
    round: 0,
    playerCoins: game.initialBudget,
    averageCoins: game.initialBudget,
    playerBet: 0,
  };

  // Build data from game rounds
  for (const round of game.rounds) {
    data[round.round] = {
      round: round.round,
      averageCoins: round.averageCoinsLeft,
    };
  }

  let totalCoinsPlayed = 0;

  for (const roundHistory of player.roundHistory) {
    if (data[roundHistory.round]) {
      totalCoinsPlayed += roundHistory.coinsPlayed;
      data[roundHistory.round].playerCoins = game.initialBudget - totalCoinsPlayed;
      data[roundHistory.round - 1].playerBet = roundHistory.coinsPlayed;
    } else {
      // Handle case where player has round data but game doesn't
      data[roundHistory.round] = {
        round: roundHistory.round,
        playerCoins: roundHistory.coinsPlayed,
        averageCoins: 0,
        playerBet: roundHistory.coinsPlayed,
      };
    }
  }

  return data;
}
