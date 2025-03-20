import { useState, useEffect } from "react";
import styles from "../styles/CoinsCountdown.module.css";
import AnimatedDigit from "@/components/universal/AnimateDigit";

interface CoinsCountdownProps {
  intervalMs?: number; // Interval in milliseconds between decrements
  onComplete?: () => void; // Optional callback when countdown reaches zero
  count: number; // Current countdown value
  setCount: React.Dispatch<React.SetStateAction<number>>; // Function to set the countdown value
  isCountdownRunning?: boolean; // Optional prop to control the countdown state
}

export default function CoinsCountdown({
  intervalMs = 150, // 0.2 seconds
  onComplete,
  count,
  setCount,
  isCountdownRunning = false, // Default to false
}: CoinsCountdownProps) {
  // Create countdown effect
  useEffect(() => {
    if (!isCountdownRunning) return;

    // Reset count when initialNumber changes
    setCount(count);

    // Don't start countdown if already at zero
    if (count <= 0) {
      if (onComplete) onComplete();
      return;
    }

    // Set up interval to decrement count
    const interval = setInterval(() => {
      setCount((prevCount: number) => {
        // When we reach 1, clear interval and call onComplete
        if (prevCount <= 1) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 0;
        }
        return prevCount - 1;
      });
    }, intervalMs);

    // Clean up interval on unmount or when deps change
    return () => clearInterval(interval);
  }, [count, intervalMs, onComplete, setCount, isCountdownRunning]);

  return (
    <div className={styles.container}>
      <div className={styles.countdownContainer}>
        {count
          .toString()
          .split("")
          .map((digit, index) => (
            <AnimatedDigit
              key={`digit-${index}`}
              value={digit}
              duration={0.5}
            />
          ))}
      </div>
    </div>
  );
}
