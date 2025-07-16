import styles from "./styles/EliminationReport.module.css";
import React, { useState } from "react";
import { motion } from "framer-motion";
import PlayedCoinsChart from "./PlayedCoinsChart";
import { IconCoins } from "@tabler/icons-react";
import { StaggeredText } from "../../StaggeredText";

const StatsPage = () => {
  return (
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
  );
};

export default StatsPage;
