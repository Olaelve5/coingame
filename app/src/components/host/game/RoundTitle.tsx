import { motion } from "framer-motion";
import { useConnectionStore } from "@/store/connectionStore";
import { roundTitleAnimation } from "@/utils/animationUtils";
import styles from "../styles/HostGame.module.css";
import { useEffect, useRef, useState } from "react";

// Define the interface for the props
interface RoundTitleProps {
  handleRoundStart: () => void;
}

export default function RoundTitle({ handleRoundStart }: RoundTitleProps) {
  const { game } = useConnectionStore();
  const [animationState, setAnimationState] = useState("initial");
  const animationHandled = useRef(false); // Track if animation has been handled, to prevent multiple calls

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState("big"); // Animate to 'big' after a short delay
      setTimeout(() => {
        setAnimationState("normal"); // Animate to 'normal' after 'big' state
      }, 2000); // Delay in 'big' state (adjust as needed)
    }, 1000); // Initial delay before starting animation (adjust as needed)

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);

  if (!game) return null;

  return (
    <motion.div
      animate={animationState}
      variants={roundTitleAnimation}
      onAnimationComplete={() => {
        if (animationState === "normal" && !animationHandled.current) {
          console.log("Animation complete - handling round start");
          animationHandled.current = true; // Set to true to prevent multiple calls
          handleRoundStart();
        }
      }}
      className={styles.title}>
      <h2>Round</h2>
      <h2 className={styles.number}>{game.round}</h2>
    </motion.div>
  );
}
