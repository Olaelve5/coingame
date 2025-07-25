import React, { useState } from "react";
import styles from "./styles/EliminationReport.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useMantineTheme } from "@mantine/core";
import EliminationsPage from "./EliminationsPage";
import EliminatedPlayers from "./EliminatedPlayers";
import PageIndicators from "./PageIndicators";
import StatsPage from "./StatsPage";

const EliminationReport = () => {
  const [initialAnimationFinished, setInitialAnimationFinished] = useState(false);
  const [page, setPage] = useState(1);
  const [hasPageChanged, setHasPageChanged] = useState(false);

  const handleSetPage = (newPage: number) => {
    setHasPageChanged(true);
    setPage(newPage);
  };

  const getSlideVariants = (page: number) => {
    return {
      enter: {
        x: page === 1 ? "-100%" : "100%",
        opacity: 1,
      },
      center: {
        x: 0,
        opacity: 1,
      },
      exit: {
        x: page === 1 ? "-100%" : "100%",
        opacity: 1,
      },
    };
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
      {/* <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Elimination Report</h2>
          <h2 className={styles.title} style={{ color: theme.colors.blue[5] }}>
            1
          </h2>
        </div>
      </div> */}

      {initialAnimationFinished && (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={getSlideVariants(page)}
            initial={page === 1 && !hasPageChanged ? false : "enter"}
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={styles.pageContainer}
          >
            {page === 1 && <EliminationsPage hasPageChanged={hasPageChanged} />}
            {page === 2 && <StatsPage />}
          </motion.div>
        </AnimatePresence>
      )}

      {/* <PageIndicators page={page} setPage={handleSetPage} /> */}
    </motion.div>
  );
};

export default EliminationReport;
