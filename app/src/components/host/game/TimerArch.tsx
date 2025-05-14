import { motion } from "framer-motion";
import styles from "../styles/Timer.module.css";

interface TimerProps {
  timeRemaining: number;
  initialTime: number;
}

export default function TimerArch({ timeRemaining, initialTime }: TimerProps) {
  // Calculate width percentage based on time remaining
  const widthPercentage = (timeRemaining / initialTime) * 100;

  return (
    <div className={styles.archContainer}>
      <motion.div
        className={styles.arch}
        initial={{ width: "100%" }}
        animate={{
          width: `${widthPercentage}%`,
        }}
        transition={{
          ease: "linear",
        }}
      />
    </div>
  );
}
