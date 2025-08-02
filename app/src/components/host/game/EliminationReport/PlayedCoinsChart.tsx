import React, { useState, useEffect } from "react";
import { BarChart } from "@mantine/charts";
import { useConnectionStore } from "@/store/connectionStore";
import { getLastRoundChartData } from "@/utils/chartUtils";
import styles from "./styles/RoundStats.module.css";
import { StaggeredText } from "../../StaggeredText";
import { motion } from "framer-motion";
import { IconReportAnalytics } from "@tabler/icons-react";

const PlayedCoinsChart = () => {
  const { game } = useConnectionStore();
  const [showChart, setShowChart] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  if (!game) return null;

  const playersAlive = game.players.filter((player) => !player.eliminated);
  const data = getLastRoundChartData(playersAlive, game.round || 0);

  useEffect(() => {
    if (showChart) {
      const timeout = setTimeout(() => {
        setShowLabels(true);
      }, 600); // Should be the same as the animation duration of the bars

      return () => clearTimeout(timeout);
    }
  }, [showChart]);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <IconReportAnalytics className={styles.chartIcon} size={30} />
        <StaggeredText text="Round Distribution" initialDelay={0.4} staggerSpeed={0.02} />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 1, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7, ease: "easeInOut" }}
        className={styles.chartContainer}
        onAnimationComplete={() => setShowChart(true)}
      >
        {showChart && (
          <BarChart
            h={200}
            data={data}
            dataKey="intervalLow"
            className={styles.chart}
            classNames={{
              axis: showLabels ? styles.axisVisible : styles.axisHidden,
            }}
            series={[{ name: "count", color: "blue.4" }]}
            tickLine="none"
            gridAxis="none"
            barProps={{
              radius: 5,
              isAnimationActive: true,
              dataKey: "count",
              animationDuration: 600,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default PlayedCoinsChart;
