import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/Timer.module.css";
import { useConnectionStore } from "@/store/connectionStore";

interface TimerProps {
  initialTime?: number; // Initial time in seconds, default 60
  onTimeUp?: () => void; // Callback when timer reaches zero
}

// Component for each individual digit with its own animation
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

export default function Timer({ initialTime = 20, onTimeUp }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const { game } = useConnectionStore();
  const [lastRoundState, setLastRoundState] = useState(game?.roundStatus);

  // Handle the countdown logic with decisecond precision
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTimeSeconds = (currentTime - startTime) / 1000;
        const newTimeRemaining = Math.max(initialTime - elapsedTimeSeconds, 0);

        setTimeRemaining(newTimeRemaining);

        if (newTimeRemaining <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          if (onTimeUp) onTimeUp();
        }
      }, 100); // Update every 100ms (decisecond)
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, initialTime, onTimeUp]);

  useEffect(() => {
    // Check if the game round status has changed
    if (game?.roundStatus !== lastRoundState) {
      setIsRunning(false);
      setTimeRemaining(initialTime);
      setLastRoundState(game?.roundStatus);
      setStartTime(Date.now());
    }

    // Start the timer when the game round status is "started"
    if (game?.roundStatus === "active" && !isRunning) {
      startTimer();
    }
  }, [game?.roundStatus]);

  // Format the time as minutes:seconds (M:SS)
  const formatTime = (time: number) => {
    const seconds = Math.floor(time % 60);
    return `${seconds.toString().padStart(2, "0")}`;
  };

  const timeString = formatTime(timeRemaining);

  // Timer controls
  const startTimer = () => {
    setIsRunning(true), setStartTime(Date.now());
  };

  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        <div className={styles.timerText}>
          {timeString.split("").map((digit, index) => (
            <AnimatedDigit key={`digit-${index}`} value={digit} />
          ))}
        </div>
      </div>
    </div>
  );
}
