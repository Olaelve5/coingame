import { motion } from "framer-motion";
import styles from "./styles/AnimateDigit.module.css";

const AnimatedDigit = ({
  value,
  duration = 0.5,
}: {
  value: string;
  duration?: number;
}) => {
  return (
    <div className={styles.digitContainer}>
      <motion.div
        key={value}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: duration }}
        className={styles.digit}>
        {value}
      </motion.div>
    </div>
  );
};

export default AnimatedDigit;
