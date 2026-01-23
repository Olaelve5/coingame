import React, { useState } from "react";
import styles from "./styles/EliminationReport.module.css";
import { motion, AnimatePresence } from "framer-motion";
import EliminatedPlayers from "./EliminatedPlayers";
import { useConnectionStore } from "@/store/connectionStore";
import StartRoundButton from "./StartRoundButton";
import CoinsCountdown from "./CoinsCountdown";

const START_NUMBER = 99;

const EliminationReport = () => {
  const { game } = useConnectionStore();
  const [count, setCount] = useState(START_NUMBER);
  const [countdownComplete, setCountdownComplete] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {!countdownComplete ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{ width: "100%", height: "100%" }}
          >
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
                setTimeout(() => {
                  setCountdownComplete(true);
                }, 500);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="players"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ width: "100%", height: "100%" }}
            className={styles.contentContainer}
          >
            <EliminatedPlayers />
          </motion.div>
        )}
      </AnimatePresence>

      {countdownComplete && (
        <div className={styles.buttonContainer}>
          <StartRoundButton />
        </div>
      )}
    </div>
  );
};

export default EliminationReport;
