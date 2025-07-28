import { IconCoins, IconCoinFilled } from "@tabler/icons-react";
import styles from "./styles/EliminatedPlayers.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getColor, getIcon } from "@/utils/iconUtils";
import { motion } from "framer-motion";
import { useConnectionStore } from "@/store/connectionStore";
import { testPlayer } from "@/utils/testPlayerUtils";

// Correct destructuring
const EliminatedPlayers = () => {
  const { game } = useConnectionStore();

  // Use test player if no real players are passed
  const displayPlayers = !game
    ? [testPlayer]
    : game.players.filter((player) => !player.eliminated && player.playedInRound);

  displayPlayers.sort((a, b) => {
    const aLastRound = a.roundHistory[a.roundHistory.length - 1];
    const bLastRound = b.roundHistory[b.roundHistory.length - 1];
    return (aLastRound?.coinsPlayed || 0) - (bLastRound?.coinsPlayed || 0);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: "0%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={styles.container}
    >
      <div className={styles.titleContainer}>
        <IconCoins className={styles.coinsIcon} stroke={2} />
        <h1>Player Bets</h1>
      </div>
      <div className={styles.playersContainer}>
        {displayPlayers.map((player) => {
          const lastRound = player.roundHistory[player.roundHistory.length - 1];
          const isEliminated = game?.lastRoundResults?.playersEliminated.some(
            (eliminatedPlayer) => eliminatedPlayer.id === player.id
          );

          return (
            <div key={player.id} className={styles.playerContainer} style={isEliminated ? {} : {}}>
              <FontAwesomeIcon icon={getIcon(player.icon)} className={styles.playerIcon} />
              <p>{player.name}</p>
              <div className={styles.playedCoinsContainer}>
                <IconCoinFilled className={styles.coinIcon} />
                <p>{lastRound?.coinsPlayed ?? 0}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default EliminatedPlayers;
