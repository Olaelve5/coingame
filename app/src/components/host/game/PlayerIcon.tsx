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
  gridPosition: {
    gridRow?: number;
    gridColumn?: number;
  };
}

export default function PlayerIcon({
  player,
  index,
  gridPosition,
  testingSignal,
}: PlayerIconProps) {
  const { scope, playExitAnimation, playRotateAnimation } =
    usePlayerIconAnimations();

  useEffect(() => {
    // Set up interval for random animation
    const interval = setInterval(() => {
      // 1 in 10 chance
      if (Math.random() < 0.1) {
        playRotateAnimation();
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (testingSignal) {
      playExitAnimation();
    }
  }, [testingSignal]);

  return (
    <>
      <motion.div
        key={player.id}
        ref={scope}
        className={styles.iconContainer}
        style={gridPosition}
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.1, type: "spring", bounce: 0.5 }}>
        <FontAwesomeIcon
          icon={getIcon(player.icon)}
          size="2x"
          color={getColor(player.color)}
        />
      </motion.div>
      {testingSignal && <PlayerIconParticles color={player.color} />}
    </>
  );
}
