import { LineChart } from "@mantine/charts";
import styles from "./styles/RoundHistoryGraph.module.css";
import { useMantineTheme } from "@mantine/core";
import { Player } from "@/models/Game";
import { getPlayerRoundsData } from "@/utils/chartUtils";
import { useConnectionStore } from "@/store/connectionStore";

const RoundHistoryGraph = ({ player }: { player: Player }) => {
  const { game } = useConnectionStore();
  const playerRoundsData = getPlayerRoundsData(player, game?.round || 0);

  // Sample data for the line chart
  const data = Object.entries(playerRoundsData).map(([round, coins]) => ({
    round: Number(round),
    winner: `Player ${round}`,
    coins,
  }));

  const theme = useMantineTheme();

  const averageCoins = data.reduce((acc, curr) => acc + curr.coins, 0) / data.length;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Round History</h2>
        <div className={styles.coinsLeftContainer}>
          <h2 className={styles.coinsLeft}>{player.coins}</h2>
          <h2>coins left</h2>
        </div>
      </div>
      <LineChart
        h={250}
        w={"100%"}
        data={data}
        curveType="natural"
        type="gradient"
        series={[{ name: "coins", label: "Coins" }]}
        dataKey="round"
        gridAxis="none"
        strokeWidth={4}
        yAxisProps={{ domain: [0, game?.initialBudget || 100] }}
        className={styles.chart}
        style={{
          background: theme.colors.gray[9],
        }}
        gradientStops={[
          { offset: 0, color: "blue.5" },
          { offset: 20, color: "cyan.5" },
          { offset: 40, color: "lime.5" },
          { offset: 70, color: "yellow.5" },
          { offset: 80, color: "orange.6" },
          { offset: 100, color: "red.6" },
        ]}
      />
    </div>
  );
};

export default RoundHistoryGraph;
