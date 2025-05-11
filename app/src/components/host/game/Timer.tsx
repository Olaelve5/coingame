import { useState, useEffect } from "react";
import styles from "../styles/Timer.module.css";
import AnimatedDigit from "@/components/universal/AnimateDigit";
import { motion } from "framer-motion";
import { useTimerAnimations } from "@/utils/animations/timerAnimations";

interface TimerProps {
  initialTime?: number;
  onTimeUp?: () => void;
  timerRunning: boolean;
  testingSignal?: boolean;
  startEliminationAnimations?: boolean;
}

export default function Timer({
  initialTime = 20,
  onTimeUp,
  timerRunning = false,
  testingSignal = false,
  startEliminationAnimations = false,
}: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [startTime, setStartTime] = useState(0);
  const [timeUpTriggered, setTimeUpTriggered] = useState(false);
  const { scope, playAppearAnimation, playBaloonPopAnimation } =
    useTimerAnimations();

  // Handle the countdown logic with decisecond precision
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerRunning) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTimeSeconds = (currentTime - startTime) / 1000;
        const newTimeRemaining = Math.max(initialTime - elapsedTimeSeconds, 0);

        setTimeRemaining(newTimeRemaining);

        if (
          newTimeRemaining <= 0 &&
          !startEliminationAnimations &&
          !timeUpTriggered
        ) {
          setTimeUpTriggered(true);
          clearInterval(interval);
          if (onTimeUp) onTimeUp(); // Call the onTimeUp function if provided
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [timerRunning, startTime, initialTime, onTimeUp]);

  useEffect(() => {
    if (timerRunning) {
      setTimeRemaining(initialTime);
      setStartTime(Date.now());
    }
  }, [timerRunning, initialTime]);

  // Play the appear animation when the timer is mounted
  useEffect(() => {
    playAppearAnimation();
  }, []);

  useEffect(() => {
    if (startEliminationAnimations || testingSignal) {
      playBaloonPopAnimation();
    }
  }, [testingSignal, startEliminationAnimations]);

  // Format the time as minutes:seconds (M:SS)
  const formatTime = (time: number) => {
    const seconds = Math.floor(time % 60);
    return `${seconds.toString().padStart(2, "0")}`;
  };

  const timeString = formatTime(timeRemaining);

  return (
    <motion.div ref={scope} style={{ scale: 0.5, opacity: 0 }}>
      <div className={styles.container}>
        <div className={styles.timer}>
          <div className={styles.timerText}>
            {timeString.split("").map((digit, index) => (
              <AnimatedDigit key={`digit-${index}`} value={digit} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
