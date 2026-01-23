import { useEffect, useState, useCallback } from "react";
import styles from "./styles/CoinsCountdown.module.css";
import { motion } from "framer-motion";
import { useMantineTheme } from "@mantine/core";
import { Progress } from "@mantine/core";
import { on } from "events";

interface CoinsCountdownProps {
  count: number;
  setCount: (count: number) => void;
  startNumber: number;
  onComplete?: () => void;
  targetNumber: number;
  isRunning?: boolean;
}

export default function CoinsCountdown({
  count,
  setCount,
  startNumber = 99,
  onComplete,
  targetNumber,
  isRunning = true,
}: CoinsCountdownProps) {
  const [countCompleted, setCountCompleted] = useState(false);
  const [fadeInCompleted, setFadeInCompleted] = useState(false);
  const [shouldShrink, setShouldShrink] = useState(false);
  const theme = useMantineTheme();

  const startIntervalMs = 25; // Fast start speed
  const endIntervalMs = 1500; // Slow ending speed

  const [currentInterval, setCurrentInterval] = useState(startIntervalMs);

  // Generate random power when component mounts
  const [randomPower] = useState(() => Math.random() * (25 - 15) + 15);

  // Progressively slow down the countdown as it approaches the target
  const getNextIntervalMS = useCallback(
    (currentCount: number) => {
      const totalSteps = startNumber - targetNumber;
      if (totalSteps <= 0) return endIntervalMs;

      const stepsTaken = startNumber - currentCount;
      const progress = stepsTaken / totalSteps;
      const exponentialProgress = Math.pow(progress, randomPower);

      return startIntervalMs + (endIntervalMs - startIntervalMs) * exponentialProgress;
    },
    [targetNumber, randomPower]
  );

  const numberVariants = {
    counting: { scale: 1 },
    finished: {
      color: theme.colors.teal[5],
      transition: { duration: 0.05, delay: endIntervalMs / 1000 },
    },
  };

  const [progressColorReady, setProgressColorReady] = useState(false);
  const progressColorDelayMs = endIntervalMs;

  useEffect(() => {
    if (!countCompleted) {
      setProgressColorReady(false);
      return;
    }

    const id = window.setTimeout(() => setProgressColorReady(true), progressColorDelayMs);
    return () => window.clearTimeout(id);
  }, [countCompleted]);

  useEffect(() => {
    if (!fadeInCompleted || !isRunning) return;

    if (count <= targetNumber) {
      if (count <= targetNumber) {
        setCount(targetNumber);
        setCountCompleted(true);

        // Trigger onComplete callback after a delay
        setTimeout(() => {
          onComplete && onComplete();
        }, 3500);
      }
      return;
    }

    const nextInterval = getNextIntervalMS(count);
    setCurrentInterval(nextInterval);

    const timerId = setTimeout(() => {
      setCount(count - 1);
    }, nextInterval);

    return () => clearTimeout(timerId);
  }, [count, targetNumber, isRunning, getNextIntervalMS, fadeInCompleted]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      onAnimationComplete={() => setFadeInCompleted(true)}
      className={styles.container}
    >
      <div className={styles.textContainer}>
        <h1>Safety Threshold</h1>
      </div>

      <div className={styles.countdownContainer}>
        <motion.h1
          className={styles.count}
          variants={numberVariants}
          animate={countCompleted ? "finished" : "counting"}
        >
          {count
            .toString()
            .split("")
            .map((digit, index) => (
              <span key={index} className={styles.digit}>
                {digit}
              </span>
            ))}
        </motion.h1>
        <Progress
          size="xl"
          radius="md"
          striped
          value={(count / startNumber) * 100}
          color={progressColorReady ? theme.colors.teal[5] : theme.colors.red[7]}
          className={styles.progressBar}
          transitionDuration={currentInterval}
        />
      </div>
    </motion.div>
  );
}
