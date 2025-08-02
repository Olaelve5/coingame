import { Player } from "@/models/Game";

export function getLastRoundChartData(players: Player[], currentRound: number) {
  const chartData = [
    { intervalLow: 0, intervalHigh: 10, count: 0 },
    { intervalLow: 10, intervalHigh: 20, count: 0 },
    { intervalLow: 20, intervalHigh: 30, count: 0 },
    { intervalLow: 30, intervalHigh: 40, count: 0 },
    { intervalLow: 40, intervalHigh: 50, count: 0 },
    { intervalLow: 50, intervalHigh: 60, count: 0 },
    { intervalLow: 60, intervalHigh: 70, count: 0 },
    { intervalLow: 70, intervalHigh: 80, count: 0 },
    { intervalLow: 80, intervalHigh: 90, count: 0 },
    { intervalLow: 90, intervalHigh: 100, count: 0 },
  ];

  players.forEach((player) => {
    if (player.roundHistory.length > 0) {
      const lastRoundData = player.roundHistory.find((round) => round.round === currentRound);

      if (lastRoundData) {
        const coinsPlayed = lastRoundData.coinsPlayed;
        const intervalIndex = Math.floor(coinsPlayed / 10);

        if (intervalIndex >= 0 && intervalIndex < chartData.length) {
          chartData[intervalIndex].count++;
        }
      }
    }
  });

  return chartData;
}
