import { useConnectionStore } from "@/store/connectionStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/PlayerPercentage.module.css";

interface PlayerPercentage {
  testingSignal?: boolean;
}

const PlayerPercentage = ({testingSignal}: PlayerPercentage) => {
  const { game } = useConnectionStore();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (game) {
      const totalPlayersAlive = game.players.filter(
        (player) => !player.eliminated
      ).length;
      const playedPlayer = game.players.filter(
        (player) => player.playedInRound
      ).length;
      setPercentage((playedPlayer / totalPlayersAlive) * 100);
    }
  }, [game]);

  // if (!game) return null;

  const formattedPercentage = Math.round(percentage);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: 0.6,
        duration: 0.5,
        type: "spring",
        bounce: 0.4,
      }}>
      <div className={styles.container}>
        <div className={styles.barContainer}>
          <motion.div
            className={styles.bar}
            initial={{ height: 0 }}
            animate={{ height: `${50 + formattedPercentage}%` }}
            transition={{
              duration: 0.5,
              type: "spring",
              bounce: 0.35,
            }}></motion.div>
        </div>
        <div className={styles.textContainer}>
          <h2 className={styles.percentageText}>{formattedPercentage}%</h2>
          <h2 className={styles.text}>have played</h2>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerPercentage;
