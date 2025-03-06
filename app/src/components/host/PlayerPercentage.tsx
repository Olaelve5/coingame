import { useConnectionStore } from "@/store/connectionStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles/PlayerPercentage.module.css";

const PlayerPercentage = () => {
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

  if (!game) return null;

  const formattedPercentage = Math.round(percentage);

  return (
    <div className={styles.container}>
      <div className={styles.barContainer}>
        <motion.div
          className={styles.bar}
          initial={{ height: 0 }}
          animate={{ height: `${100 - formattedPercentage}%` }}
          transition={{
            duration: 0.5,
            type: "spring",
            bounce: 0.35,
          }}></motion.div>
      </div>
      <h2 className={styles.text}>{formattedPercentage}% have played</h2>
    </div>
  );
};

export default PlayerPercentage;
