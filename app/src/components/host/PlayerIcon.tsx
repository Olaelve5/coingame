import { Player } from "@/models/Game";
import { motion, useAnimate } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getColor, getIcon } from "@/utils/iconUtils";
import styles from "./styles/PlayersIconGrid.module.css";
import { useEffect, useRef } from "react";

interface PlayerIconProps {
  player: Player;
  index: number;
  gridPosition: {
    gridRow?: number;
    gridColumn?: number;
  };
}

export default function PlayerIcon({
  player,
  index,
  gridPosition,
}: PlayerIconProps) {
  const [scope, animate] = useAnimate();
  const currentRotation = useRef(0);

  const animateIcon = () => {
    // Define a sequence of animations
    animate([
      // First, tilt slightly to the left
      [scope.current, { rotate: currentRotation.current - 15 }, { duration: 0.5 }],

      // Then perform the full rotation
      [
        scope.current,
        { rotate: currentRotation.current + 360 },
        { duration: 1, type: "spring", bounce: 0.5 },
      ],
    ]);

    currentRotation.current = currentRotation.current + 360;
  };

  useEffect(() => {
    // Set up interval for random animation
    const interval = setInterval(() => {
      // 1 in 10 chance (10%)
      if (Math.random() < 0.9) {
        // Randomly choose a direction
        animateIcon();
      }
    }, 2000); // Check every 2 seconds

    // Clean up interval when component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array so it only runs once on mount

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
    </>
  );
}
