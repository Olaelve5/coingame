import { useEffect, useState, useCallback } from "react";
import styles from "./styles/CoinsCountdown.module.css";
import { motion } from "framer-motion";
import { StaggeredText } from "../../StaggeredText";
import { useMantineTheme } from "@mantine/core";
import { RingProgress } from "@mantine/core";

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
      color: theme.colors.green[5],
      transition: { duration: 0.1, delay: endIntervalMs / 1000 },
    },
  };

  const containerVariants = {
    big: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    normal: {
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    if (!fadeInCompleted || !isRunning) return;

    if (count <= targetNumber) {
      if (count <= targetNumber) {
        setCount(targetNumber);
        setCountCompleted(true);

        // Trigger onComplete callback after a delay
        setTimeout(() => {
          setShouldShrink(true);
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
      variants={containerVariants}
      animate={shouldShrink ? "normal" : "big"}
      onAnimationComplete={(definition) => {
        if (definition === "normal") {
          setCountCompleted(true);
          onComplete?.();
        }
      }}
      className={styles.container}
    >
      <div className={styles.textContainer}>
        <StaggeredText text="Safety Threshold" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1, y: 0 }}
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
          {count
            .toString()
            .split("")
            .map((digit, index) => (
              <span key={index} className={styles.digit}>
                {digit}
              </span>
            ))}
          {/* <RingProgress
            size={350}
            thickness={35}
            sections={[{ value: (count / startNumber) * 100, color: theme.colors.orange[7] }]}
            className={styles.ringProgress}
            transitionDuration={currentInterval}
            roundCaps
            rootColor="rgba(217, 200, 150, 1)"
          /> */}
        </motion.h1>
      </motion.div>
    </motion.div>
  );
}
