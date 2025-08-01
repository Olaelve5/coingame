import React, { useState } from "react";
import styles from "./styles/EliminationReport.module.css";
import { motion } from "framer-motion";
import EliminationsPage from "./EliminationsPage";
import { useGameplayStore } from "@/store/gameplayStore";
import { useMantineTheme } from "@mantine/core";
import CountdownVisual from "@/components/host/game/EliminationReport/CountdownVisual";
import { useConnectionStore } from "@/store/connectionStore";

const START_NUMBER = 99;

interface EliminationReportProps {
  handleRoundPreparation: () => void;
}

const EliminationReport = ({ handleRoundPreparation }: EliminationReportProps) => {
  const { game } = useConnectionStore();
  const [initialAnimationFinished, setInitialAnimationFinished] = useState(false);
  const theme = useMantineTheme();
  const [shouldAnimateOut, setShouldAnimateOut] = useState(false);
  const [count, setCount] = useState(START_NUMBER);
  const [countdownComplete, setCountdownComplete] = useState(false);
  const { startRound } = useGameplayStore();

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={shouldAnimateOut ? { y: "100%" } : { y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
      onAnimationComplete={() => {
        if (shouldAnimateOut) {
          handleRoundPreparation();
          startRound();
          return;
        }
        setInitialAnimationFinished(true);
      }}
      className={styles.container}
    >
      <CountdownVisual
        count={count}
        maxCount={START_NUMBER}
        countdownComplete={countdownComplete}
      />

      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Elimination Report</h2>
          <h2 className={styles.title} style={{ color: theme.colors.blue[5] }}>
            {game?.round || "?"}
          </h2>
        </div>
      </div>
      <EliminationsPage
        count={count}
        setCount={setCount}
        START_NUMBER={START_NUMBER}
        countdownComplete={countdownComplete}
        setCountdownComplete={setCountdownComplete}
        setShouldAnimateOut={setShouldAnimateOut}
        initialAnimationFinished={initialAnimationFinished}
      />
    </motion.div>
  );
};

export default EliminationReport;
