import { CompositeChart } from "@mantine/charts";
import styles from "./styles/RoundHistoryGraph.module.css";
import { useMantineTheme } from "@mantine/core";
import { Player } from "@/models/Game";
import { getRoundChartsData } from "@/utils/chartUtils";
import { useConnectionStore } from "@/store/connectionStore";
import GraphCheckboxes from "./GraphCheckboxes";

interface GraphCheckboxesProps {
  player: Player;
  showPlayerBets: boolean;
  showAverageCoins: boolean;
  setShowPlayerBets: (value: boolean) => void;
  setShowAverageCoins: (value: boolean) => void;
}

const RoundHistoryGraph = ({
  player,
  showPlayerBets,
  showAverageCoins,
  setShowPlayerBets,
  setShowAverageCoins,
}: GraphCheckboxesProps) => {
  const { game } = useConnectionStore();
  const dataObject = game ? getRoundChartsData(game, player) : {};
  const data = Object.values(dataObject);
  const theme = useMantineTheme();

  const allSeries = [
    {
      name: "averageCoins",
      label: "Average Budget",
      color: "rgba(255, 0, 144, 0.6)",
      type: "line" as const,
    },
    {
      name: "playerCoins",
      label: "Player Budget",
      color: "rgba(0, 132, 255, 0.6)",
      type: "line" as const,
    },
    {
      name: "playerBet",
      label: "Player Bet",
      color: showPlayerBets ? "yellow.5" : "transparent",
      type: "bar" as const,
    },
  ];

  // Dynamically filter the series based on state
  const visibleSeries = allSeries.filter((series) => {
    if (series.name === "averageCoins") {
      return showAverageCoins;
    }
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2>Budget Timeline</h2>
        <div className={styles.coinsLeftContainer}>
          <h2 className={styles.coinsLeft}>{player.coins}</h2>
          <h2>coins left</h2>
        </div>
      </div>
      <CompositeChart
        h={280}
        w={"100%"}
        data={data}
        curveType="monotone"
        maxBarWidth={20}
        series={visibleSeries}
        withLegend
        legendProps={{
          verticalAlign: "top",
          height: 35,
        }}
        dataKey="round"
        gridAxis="none"
        strokeWidth={2}
        withDots={false}
        yAxisProps={{ domain: [0, game?.initialBudget || 100] }}
        xAxisProps={{ padding: { left: -20, right: -20 } }}
        className={styles.chart}
        style={{
          background: theme.colors.gray[9],
        }}
      />
      <GraphCheckboxes
        showPlayerBets={showPlayerBets}
        showAverageCoins={showAverageCoins}
        setShowPlayerBets={setShowPlayerBets}
        setShowAverageCoins={setShowAverageCoins}
      />
    </div>
  );
};

export default RoundHistoryGraph;
