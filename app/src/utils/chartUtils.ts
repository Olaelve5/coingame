import { Player } from "@/models/Game";

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
