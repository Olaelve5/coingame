import styles from "./styles/PageIndicators.module.css";
import { motion } from "framer-motion";

interface PageIndicatorsProps {
  page: number;
  setPage: (page: number) => void;
}

const PageIndicators = ({ page, setPage }: PageIndicatorsProps) => {
  return (
    <div className={styles.container}>
      <motion.span
        className={styles.indicator}
        animate={{
          width: page === 1 ? "2rem" : "0.75rem",
          backgroundColor: page === 1 ? "#339af0" : "#666",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={() => setPage(1)}
      />
      <motion.span
        className={styles.indicator}
        animate={{
          width: page === 2 ? "2rem" : "0.75rem",
          backgroundColor: page === 2 ? "#339af0" : "#666",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={() => setPage(2)}
      />
    </div>
  );
};

export default PageIndicators;
