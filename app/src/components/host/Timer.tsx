import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./styles/Timer.module.css";

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

export default function Timer({ initialTime = 30, onTimeUp }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle the countdown logic with second precision
  useEffect(() => {
    if (isRunning) {
      // Update every second
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          // Decrement by 1 second each time
          const newTime = prevTime - 1;

          if (newTime <= 0) {
            // Time's up!
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 1000); // 1 second interval
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUp]);

  // Format the time as minutes:seconds (M:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const timeString = formatTime(timeRemaining);

  // Timer controls
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(initialTime);
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
      <div className={styles.controls}>
        {!isRunning ? (
          <button className={styles.startButton} onClick={startTimer}>
            Start
          </button>
        ) : (
          <button className={styles.pauseButton} onClick={pauseTimer}>
            Pause
          </button>
        )}
        <button className={styles.resetButton} onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}
