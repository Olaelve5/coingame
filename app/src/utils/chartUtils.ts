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

  let playerCoinsRemaining = game.initialBudget;

  // Round 1: Initial state
  data[1] = {
    round: 1,
    playerCoins: playerCoinsRemaining,
    averageCoins: game.initialBudget,
  };

  // ✅ Find the last round the player participated in
  const playerLastRound = Math.max(...player.roundHistory.map((r) => r.round), 0);

  // ✅ Add bets and calculate remaining coins for each round
  for (let roundNum = 1; roundNum <= game.round; roundNum++) {
    // Ensure we have data for this round
    if (!data[roundNum]) {
      data[roundNum] = {
        round: roundNum,
        // ✅ Only show player coins if they're still in the game
        playerCoins: roundNum <= playerLastRound ? playerCoinsRemaining : undefined,
        averageCoins: game.initialBudget,
      };
    }

    const playerBet = player.roundHistory.find((r) => r.round === roundNum);

    // ✅ Add player's bet for this round (only if they played)
    if (playerBet) {
      data[roundNum].playerBet = playerBet.coinsPlayed;
      playerCoinsRemaining -= playerBet.coinsPlayed;
    }

    // Set up next round with remaining coins
    const nextRound = roundNum + 1;
    if (nextRound <= game.round + 1) {
      const gameRoundData = game.rounds.find((r) => r.round === roundNum);
      data[nextRound] = {
        round: nextRound,
        // ✅ Only show player coins if they played in the current round
        playerCoins: playerBet ? playerCoinsRemaining : undefined,
        averageCoins: gameRoundData?.averageCoinsLeft || game.initialBudget,
      };
    }
  }

  return data;
}
