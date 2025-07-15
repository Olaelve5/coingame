import React, { useState } from "react";
import styles from "./styles/EliminationReport.module.css";
import { motion } from "framer-motion";
import PlayedCoinsChart from "./PlayedCoinsChart";
import { useMantineTheme } from "@mantine/core";
import { IconCoins } from "@tabler/icons-react";
import EliminatedPlayers from "./EliminatedPlayers";
import { StaggeredText } from "../../StaggeredText";
import StartRoundButton from "./StartRoundButton";

const EliminationReport = () => {
  const [initialAnimationFinished, setInitialAnimationFinished] = useState(false);
  const theme = useMantineTheme();

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
      onAnimationComplete={() => setInitialAnimationFinished(true)}
      className={styles.container}
    >
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Report Round</h2>
          <h2 className={styles.title} style={{ color: theme.colors.blue[5] }}>
            1
          </h2>
        </div>
        <StartRoundButton />
      </div>
      {initialAnimationFinished && (
        <div className={styles.dataContainer}>
          <div className={styles.coinsPlayedContainer}>
            <StaggeredText text="Coins played this round" staggerSpeed={0.02} />
            <motion.div
              initial={{ opacity: 0, scale: 1, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8, ease: "easeInOut" }}
            >
              <IconCoins className={styles.coinsIcon} />
              <h2>887</h2>
            </motion.div>
          </div>
          <PlayedCoinsChart />
        </div>
      )}
      {initialAnimationFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2, ease: "easeInOut" }}
        >
          <EliminatedPlayers playersEliminated={[]} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default EliminationReport;
