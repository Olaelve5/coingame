import { BarChart } from "@mantine/charts";
import styles from "./styles/RoundHistoryGraph.module.css";
import { useMantineTheme } from "@mantine/core";
import { Player } from "@/models/Game";
import { getRoundChartsData } from "@/utils/chartUtils";
import { useConnectionStore } from "@/store/connectionStore";

const RoundHistoryBarChart = ({ player }: { player: Player }) => {
  const { game } = useConnectionStore();
  const dataObject = game ? getRoundChartsData(game, player) : {};
  const data = Object.values(dataObject);
  const theme = useMantineTheme();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Round History</h2>
        <div className={styles.coinsLeftContainer}>
          <h2 className={styles.coinsLeft}>{player.coins}</h2>
          <h2>coins left</h2>
        </div>
      </div>
      <BarChart
        h={250}
        w={600}
        data={data}
        series={[
          { name: "playerCoins", label: "Player Coins", color: "blue.5" },
          { name: "averageCoins", label: "Average", color: "yellow.5" },
          { name: "safeCoins", label: "Safe Amount", color: "green.5" },
        ]}
        dataKey="round"
        gridAxis="none"
        yAxisProps={{ domain: [0, game?.initialBudget || 100] }}
        className={styles.chart}
        style={{
          background: theme.colors.gray[9],
        }}
      />
    </div>
  );
};

export default RoundHistoryBarChart;
