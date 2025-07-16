import React, { useState } from "react";
import styles from "./styles/EliminationReport.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useMantineTheme } from "@mantine/core";
import EliminatedPlayers from "./EliminatedPlayers";
import PageIndicators from "./PageIndicators";
import StatsPage from "./StatsPage";

const EliminationReport = () => {
  const [initialAnimationFinished, setInitialAnimationFinished] = useState(false);
  const [page, setPage] = useState(1);
  const theme = useMantineTheme();

  const slideVariants = {
    enter: {
      x: "100%",
      opacity: 1,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: "-100%",
      opacity: 1,
    },
  };

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
      </div>

      {initialAnimationFinished && (
        <div className={styles.carouselContainer}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={styles.pageContainer}
            >
              {page === 1 && <StatsPage />}
              {page === 2 && <EliminatedPlayers playersEliminated={[]} />}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <PageIndicators page={page} setPage={setPage} />
    </motion.div>
  );
};

export default EliminationReport;
