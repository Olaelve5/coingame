import { motion } from "framer-motion";
import styles from "./styles/AnimateDigit.module.css";

const AnimatedDigit = ({ value }: { value: string }) => {
  return (
    <div className={styles.digitContainer}>
      <motion.div
        key={value}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
        className={styles.digit}>
        {value}
      </motion.div>
    </div>
  );
};

export default AnimatedDigit;
