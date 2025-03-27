import { useEffect, useRef } from "react";
import styles from "../styles/CoinsCountdown.module.css";
import AnimatedDigit from "@/components/universal/AnimateDigit";
import { IconHexagonFilled } from "@tabler/icons-react";

interface CoinsCountdownProps {
  intervalMs?: number;
  onComplete?: () => void;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  playerCoinValues?: number[];
  pauseDuration?: number;
  isCountdownRunning?: boolean;
}

export default function CoinsCountdown({
  intervalMs = 150,
  onComplete,
  count,
  setCount,
  playerCoinValues = [],
  pauseDuration = 50,
  isCountdownRunning = false,
}: CoinsCountdownProps) {
  const isPaused = useRef(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add this after your other refs
  const processedValues = useRef<Set<number>>(new Set());

  // Create countdown effect
  useEffect(() => {
    // Clear any existing timers on dependency changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    // Reset pause state
    isPaused.current = false;

    // Don't proceed if countdown is not running
    if (!isCountdownRunning) return;

    // Don't start countdown if already at zero
    if (count <= 0) {
      if (onComplete) onComplete();
      return;
    }

    // Function to check if we should pause at this count
    const shouldPauseAtCount = (currentCount: number): boolean => {
      return playerCoinValues.includes(currentCount);
    };

    // Function to perform one countdown tick
    const tick = () => {
      setCount((prevCount) => {
        // When we reach 0 or 1, stop and call onComplete
        if (prevCount <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (onComplete) onComplete();
          return 0;
        }

        const nextCount = prevCount - 1;

        // If we hit a player's coin value and aren't already paused, pause the countdown
        if (
          shouldPauseAtCount(nextCount + 1) &&
          !isPaused.current &&
          !processedValues.current.has(nextCount)
        ) {
          processedValues.current.add(nextCount); // Add to processed values
          isPaused.current = true;

          // Schedule resumption
          pauseTimerRef.current = setTimeout(() => {
            isPaused.current = false;
            pauseTimerRef.current = null;
          }, pauseDuration);

          // Return current count (don't decrement yet)
          return prevCount;
        }

        // Only decrement if not paused
        return isPaused.current ? prevCount : nextCount;
      });
    };

    // Set up the interval
    intervalRef.current = setInterval(tick, intervalMs);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [
    isCountdownRunning,
    intervalMs,
    onComplete,
    playerCoinValues,
    pauseDuration,
  ]);

  return (
    <div className={styles.container}>
      <IconHexagonFilled className={styles.hexagon} />
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
