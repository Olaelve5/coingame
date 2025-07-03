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
      <BarChart
        h={300}
        data={data}
        dataKey="intervalLow"
        yAxisProps={{ domain: [0, 20] }}
        series={[{ name: "count", color: "blue.5" }]}
        tickLine="none"
        gridAxis="none"
      />
    </div>
  );
};

export default PlayedCoinsChart;
