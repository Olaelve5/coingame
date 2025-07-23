import { useEffect, useState, useCallback } from "react";
import styles from "../styles/CoinsCountdown.module.css";
import { motion } from "framer-motion";
import { StaggeredText } from "../StaggeredText";
import { IconCoinFilled } from "@tabler/icons-react";

interface CoinsCountdownProps {
  onComplete?: () => void;
  targetNumber: number;
  isRunning?: boolean;
}

// Starting number for the countdown
const START_NUMBER = 99;

export default function CoinsCountdown({
  onComplete,
  targetNumber,
  isRunning = true,
}: CoinsCountdownProps) {
  const [count, setCount] = useState(START_NUMBER);
  const [countCompleted, setCountCompleted] = useState(false);
  const [fadeInCompleted, setFadeInCompleted] = useState(false);

  const startIntervalMs = 25; // Fast start speed
  const endIntervalMs = 1000; // Slow ending speed

  // Progressively slow down the countdown as it approaches the target
  const getNextIntervalMS = useCallback(
    (currentCount: number) => {
      const totalSteps = START_NUMBER - targetNumber;
      if (totalSteps <= 0) return endIntervalMs;

      const stepsTaken = START_NUMBER - currentCount;
      const progress = stepsTaken / totalSteps;
      const exponentialProgress = Math.pow(progress, 18); // Exponential curve for slowing down

      return startIntervalMs + (endIntervalMs - startIntervalMs) * exponentialProgress;
    },
    [targetNumber]
  );

  const numberVariants = {
    counting: { scale: 1 },
    finished: {
      scale: [1, 1, 1],
      color: "#22c55e",
      transition: { duration: 0.1, delay: endIntervalMs / 1000 },
    },
  };

  useEffect(() => {
    if (!fadeInCompleted || !isRunning) return;

    if (count <= targetNumber) {
      if (count <= targetNumber) {
        setCount(targetNumber);
        setCountCompleted(true);
        onComplete?.();
      }
      return;
    }

    const timerId = setTimeout(() => {
      setCount((prevCount) => prevCount - 1);
    }, getNextIntervalMS(count));

    return () => clearTimeout(timerId);
  }, [count, targetNumber, isRunning, onComplete, getNextIntervalMS, fadeInCompleted]);

  return (
    <div className={styles.container}>
      <StaggeredText text="Safety Threshold" />
      <motion.div
        initial={{ opacity: 0, scale: 1, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onAnimationComplete={() => setFadeInCompleted(true)}
        className={styles.countdownContainer}
      >
        <motion.h1
          className={styles.count}
          variants={numberVariants}
          animate={countCompleted ? "finished" : "counting"}
        >
          {count}
        </motion.h1>
      </motion.div>
    </div>
  );
}
