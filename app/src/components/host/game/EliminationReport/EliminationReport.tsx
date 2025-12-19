import React, { useState } from "react";
import styles from "./styles/EliminationReport.module.css";
import { motion } from "framer-motion";
import EliminationsPage from "./EliminationsPage";
import { useGameplayStore } from "@/store/gameplayStore";
import { useMantineTheme } from "@mantine/core";
import { useConnectionStore } from "@/store/connectionStore";
import StartRoundButton from "./StartRoundButton";
import CoinsCountdown from "./CoinsCountdown";

const START_NUMBER = 99;

interface EliminationReportProps {
  handleRoundPreparation: () => void;
}

const EliminationReport = ({ handleRoundPreparation }: EliminationReportProps) => {
  const { game } = useConnectionStore();
  const theme = useMantineTheme();
  const [shouldAnimateOut, setShouldAnimateOut] = useState(false);
  const [count, setCount] = useState(START_NUMBER);
  const [countdownComplete, setCountdownComplete] = useState<boolean>(
    game?.gameSettings.fastMode || false
  );

  return (
    <div className={styles.container}>
      <CoinsCountdown
        count={count}
        setCount={setCount}
        startNumber={START_NUMBER}
        targetNumber={
          game?.lastRoundResults.safeCoinsAmount !== undefined
            ? game.lastRoundResults.safeCoinsAmount
            : 0
        }
        onComplete={() => {
          setCountdownComplete(true);
        }}
      />
      {/* <EliminationsPage
        count={count}
        setCount={setCount}
        START_NUMBER={START_NUMBER}
        countdownComplete={countdownComplete}
        setCountdownComplete={setCountdownComplete}
        setShouldAnimateOut={setShouldAnimateOut}
        initialAnimationFinished={initialAnimationFinished}
      /> */}

      {countdownComplete && <StartRoundButton />}
    </div>
  );
};

export default EliminationReport;
