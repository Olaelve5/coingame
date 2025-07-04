import { AreaChart, BarChart } from "@mantine/charts";
import { useConnectionStore } from "@/store/connectionStore";
import { getLastRoundChartData } from "@/utils/chartUtils";
import styles from "./styles/PlayedcoinsChart.module.css";
import { StaggeredText } from "../../StaggeredText";
import { motion } from "framer-motion";

const PlayedCoinsChart = () => {
  const { game } = useConnectionStore();

  //   if (!game) return null;

  //   const playersAlive = game.players.filter((player) => !player.eliminated);
  const data = getLastRoundChartData([], 1);

  return (
    <div className={styles.container}>
      <StaggeredText text="Round Distribution" initialDelay={0.4} staggerSpeed={0.02} />
      <motion.div
        initial={{ opacity: 0, scale: 1, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.1, ease: "easeInOut" }}
        className={styles.chartContainer}
      >
        <BarChart
          h={180}
          data={data}
          dataKey="intervalLow"
          className={styles.chart}
          yAxisProps={{ domain: [0, 20] }}
          series={[{ name: "count", color: "blue.5" }]}
          tickLine="none"
          gridAxis="none"
          withYAxis={false}
        />
      </motion.div>
    </div>
  );
};

export default PlayedCoinsChart;
