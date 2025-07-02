import styles from "../../styles/EliminationReport.module.css";
import { motion } from "framer-motion";

const EliminationReport = () => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
      className={styles.container}
    >
      <h2>Elimination Report</h2>
    </motion.div>
  );
};

export default EliminationReport;
