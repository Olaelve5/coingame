import { motion } from "framer-motion";
import { useConnectionStore } from "@/store/connectionStore";
import { roundTitleAnimation } from "@/utils/animationUtils";
import styles from "../styles/HostGame.module.css";

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

  if (!game) return null;

  return (
    <motion.h2 variants={roundTitleAnimation} className={styles.title}>
      Round {game.round}
    </motion.h2>
  );
}
