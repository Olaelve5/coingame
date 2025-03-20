import { useState, useEffect } from "react";
import styles from "../styles/Timer.module.css";
import { useConnectionStore } from "@/store/connectionStore";
import AnimatedDigit from "@/components/universal/AnimateDigit";

interface TimerProps {
  initialTime?: number; // Initial time in seconds, default 60
  onTimeUp?: () => void; // Callback when timer reaches zero
  timerRunning: boolean; // Optional prop to control the timer state
}

export default function Timer({
  initialTime = 20,
  onTimeUp,
  timerRunning = false,
}: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [startTime, setStartTime] = useState(0);

  // Handle the countdown logic with decisecond precision
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerRunning) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTimeSeconds = (currentTime - startTime) / 1000;
        const newTimeRemaining = Math.max(initialTime - elapsedTimeSeconds, 0);

        setTimeRemaining(newTimeRemaining);

        if (newTimeRemaining <= 0) {
          clearInterval(interval);
          if (onTimeUp) onTimeUp(); // Uncomment if you want to call onTimeUp when time is up
        }
      }, 100); // Update every 100ms (decisecond)
    }

    return () => clearInterval(interval);
  }, [timerRunning, startTime, initialTime, onTimeUp]);

  useEffect(() => {
    if (timerRunning) {
      setTimeRemaining(initialTime);
      setStartTime(Date.now());
    }
  }, [timerRunning, initialTime]);

  // Format the time as minutes:seconds (M:SS)
  const formatTime = (time: number) => {
    const seconds = Math.floor(time % 60);
    return `${seconds.toString().padStart(2, "0")}`;
  };

  const timeString = formatTime(timeRemaining);

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
