import styles from "../../styles/EliminationReport.module.css";
import { motion } from "framer-motion";
import PlayedCoinsChart from "./PlayedCoinsChart";
import { useMantineTheme } from "@mantine/core";

const EliminationReport = () => {
  const theme = useMantineTheme();

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
      className={styles.container}
    >
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Elimination Report</h2>
        <h2 className={styles.title} style={{ color: theme.colors.blue[5] }}>
          1
        </h2>
      </div>
      <PlayedCoinsChart />
    </motion.div>
  );
};

export default EliminationReport;
