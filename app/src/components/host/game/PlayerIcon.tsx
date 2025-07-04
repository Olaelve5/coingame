import { Player } from "@/models/Game";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getColor, getIcon } from "@/utils/iconUtils";
import styles from "../styles/PlayersIconGrid.module.css";
import { useEffect, useState } from "react";
import { usePlayerIconAnimations } from "@/utils/animations/playerIconAnimations";
import PlayerIconParticles from "./PlayerIconParticle";

interface PlayerIconProps {
  player: Player;
  index: number;
  testingSignal?: boolean;
  playerIsSafe?: boolean;
  playerIsInDanger?: boolean;
  animationDelay?: number;
  gridPosition:
    | {
        gridRow?: number;
        gridColumn?: number;
      }
    | undefined;
  onAnimationComplete?: (playerId: string) => void;
}

export default function PlayerIcon({
  player,
  index,
  gridPosition,
  testingSignal,
  playerIsSafe,
  playerIsInDanger,
  animationDelay = 0,
  onAnimationComplete,
}: PlayerIconProps) {
  const { scope, playExitAnimation, playRotateAnimation } = usePlayerIconAnimations();
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // Set up interval for random animation
    const interval = setInterval(() => {
      // 1 in 10 chance
      if (Math.random() < 0.1 && !playerIsSafe && !playerIsInDanger) {
        playRotateAnimation();
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (playerIsSafe || testingSignal) {
      const timer = setTimeout(async () => {
        setShowParticles(true);
        await playExitAnimation();

        if (onAnimationComplete) {
          onAnimationComplete(player.id);
        }
      }, animationDelay * 1000);

      return () => {
        clearTimeout(timer);
        setShowParticles(false);
      };
    }
  }, [testingSignal, playerIsSafe, playerIsInDanger]);

  return (
    <motion.div
      key={player.id}
      layout
      className={styles.playerIcon}
      style={gridPosition}
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: index * 0.1, type: "spring", bounce: 0.5 }}
    >
      <motion.div ref={scope} className={styles.iconContainer}>
        <FontAwesomeIcon icon={getIcon(player.icon)} size="2x" color={getColor(player.color)} />
      </motion.div>
      {showParticles && <PlayerIconParticles color={player.color} />}
    </motion.div>
  );
}
