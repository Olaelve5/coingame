import { AreaChart, BarChart } from "@mantine/charts";
import { useConnectionStore } from "@/store/connectionStore";
import { getLastRoundChartData } from "@/utils/chartUtils";
import styles from "./styles/PlayedcoinsChart.module.css";

const PlayedCoinsChart = () => {
  const { game } = useConnectionStore();

  //   if (!game) return null;

  //   const playersAlive = game.players.filter((player) => !player.eliminated);
  const data = getLastRoundChartData([], 1);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Coins Distribution</h3>
      <BarChart
        h={200}
        data={data}
        dataKey="intervalLow"
        className={styles.chart}
        yAxisProps={{ domain: [0, 20] }}
        series={[{ name: "count", color: "blue.5" }]}
        tickLine="none"
        gridAxis="none"
        withYAxis={false}
      />
    </div>
  );
};

export default PlayedCoinsChart;
