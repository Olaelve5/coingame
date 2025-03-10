import { motion } from "framer-motion";
import { useConnectionStore } from "@/store/connectionStore";
import { roundTitleAnimation } from "@/utils/animationUtils";
import styles from "../styles/HostGame.module.css";
import { useEffect, useState } from "react";

// Define the interface for the props
interface RoundTitleProps {
  titleAnimationFinished: boolean;
  setTitleAnimationFinished: (finished: boolean) => void;
}

export default function RoundTitle({
  titleAnimationFinished,
  setTitleAnimationFinished,
}: RoundTitleProps) {
  const { game } = useConnectionStore();
  const [animationState, setAnimationState] = useState("initial");
  const [roundNumber, setRoundNumber] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!game) return;

    if (game.roundStatus === "active") {
      setRoundNumber(game.round);
    } else if (game.roundStatus === "completed") {
      setRoundNumber(game.round + 1);
    }
  }, [game]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState("big"); // Animate to 'big' after a short delay
      setTimeout(() => {
        setAnimationState("normal"); // Animate to 'normal' after 'big' state
      }, 1500); // Delay in 'big' state (adjust as needed)
    }, 500); // Initial delay before starting animation (adjust as needed)

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);

  if (!game) return null;

  return (
    <motion.div
      animate={animationState}
      variants={roundTitleAnimation}
      onAnimationComplete={() => {
        if (animationState === "normal") {
          setTitleAnimationFinished(true);
        }
      }}
      className={styles.title}>
      <h2>Round</h2>
      <h2 className={styles.number}>{roundNumber}</h2>
    </motion.div>
  );
}
