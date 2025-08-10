import { useState, useEffect } from "react";
import styles from "./styles/Timer.module.css";
import AnimatedDigit from "@/components/universal/AnimateDigit";
import { motion } from "framer-motion";
import { useTimerAnimations } from "@/utils/animations/timerAnimations";
import PlayerIconParticles from "./PlayerIconParticle";
import { useConnectionStore } from "@/store/connectionStore";
import { useMantineTheme } from "@mantine/core";

interface TimerProps {
  onTimeUp?: () => void;
  timerRunning: boolean;
  testingSignal?: boolean;
  startEliminationAnimations?: boolean;
  setTimerEndAnimationFinished?: (finished: boolean) => void;
}

export default function Timer({
  onTimeUp,
  timerRunning = false,
  testingSignal = false,
  startEliminationAnimations = false,
  setTimerEndAnimationFinished,
}: TimerProps) {
  const { game } = useConnectionStore();
  const theme = useMantineTheme();
  const [timeRemaining, setTimeRemaining] = useState(game?.gameSettings.roundTimeLimit || 40);
  const [startTime, setStartTime] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [timeUpTriggered, setTimeUpTriggered] = useState(false);
  const {
    scope,
    playAppearAnimation,
    playBaloonPopAnimation,
    playPulseAnimation,
    stopPulseAnimation,
  } = useTimerAnimations();

  // Handle the countdown logic with decisecond precision
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerRunning) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTimeSeconds = (currentTime - startTime) / 1000;
        const newTimeRemaining = Math.max(timeRemaining - elapsedTimeSeconds, 0);

        setTimeRemaining(newTimeRemaining);

        if (newTimeRemaining <= 0 && !startEliminationAnimations && !timeUpTriggered) {
          setTimeUpTriggered(true);
          clearInterval(interval);
          if (onTimeUp) onTimeUp();
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [timerRunning, startTime, timeRemaining, onTimeUp]);

  useEffect(() => {
    if (timerRunning) {
      setTimeRemaining(timeRemaining);
      setStartTime(Date.now());
    }
  }, [timerRunning, timeRemaining]);

  // Play the appear animation when the timer is mounted
  useEffect(() => {
    playAppearAnimation();
  }, []);

  // Effect for starting pulse
  useEffect(() => {
    if (timeRemaining <= 5 && !isPulsing && timerRunning) {
      setIsPulsing(true);
      playPulseAnimation();
    } else if (timeRemaining > 5 && isPulsing) {
      setIsPulsing(false);
      stopPulseAnimation();
    }
  }, [timeRemaining]);

  // Effect for stopping pulse when timer stops
  useEffect(() => {
    if (!timerRunning && isPulsing) {
      setIsPulsing(false);
      stopPulseAnimation();
    }
  }, [timerRunning]);

  useEffect(() => {
    if (startEliminationAnimations || testingSignal) {
      playBaloonPopAnimation();

      // Delay to ensure animation is finished before setting state
      setTimeout(() => {
        if (setTimerEndAnimationFinished) {
          setTimerEndAnimationFinished(true);
        }
      }, 2000); // Delay before the elimination report starts
    }
  }, [testingSignal, startEliminationAnimations]);

  // Format the time as minutes:seconds (M:SS)
  const formatTime = (time: number) => {
    const seconds = Math.floor(time % 60);
    return `${seconds.toString().padStart(2, "0")}`;
  };

  const timeString = formatTime(timeRemaining);

  return (
    <div style={{ position: "relative" }}>
      <motion.div ref={scope} style={{ scale: 0.5, opacity: 0 }}>
        <div className={styles.container}>
          <div
            className={styles.timer}
            style={{
              backgroundColor: timeRemaining <= 5 ? theme.colors.red[9] : "var(--accent)",
            }}
          >
            <div className={styles.timerText}>
              {timeString.split("").map((digit, index) => (
                <AnimatedDigit key={`digit-${index}`} value={digit} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      {(startEliminationAnimations || testingSignal) && (
        <div className={styles.particleContainer}>
          <PlayerIconParticles color={timeRemaining <= 5 ? "red" : "cyan"} distance={1.5} />
        </div>
      )}
    </div>
  );
}
