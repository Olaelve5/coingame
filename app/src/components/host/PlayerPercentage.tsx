import { useConnectionStore } from "@/store/connectionStore";
import { useEffect, useState } from "react";
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
        <div
          className={styles.bar}
          style={{ height: `${100 - formattedPercentage}%` }}></div>
      </div>
      <div className={styles.text}>Players played</div>
    </div>
  );
};

export default PlayerPercentage;
