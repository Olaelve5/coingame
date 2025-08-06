import { IconCoins, IconCoinFilled, IconNumber } from "@tabler/icons-react";
import styles from "./styles/EliminatedPlayers.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getColor, getIcon } from "@/utils/iconUtils";
import { motion } from "framer-motion";
import { useConnectionStore } from "@/store/connectionStore";
import { testPlayer } from "@/utils/testPlayerUtils";
import { StaggeredText } from "../../StaggeredText";
import { useMantineTheme } from "@mantine/core";

// Correct destructuring
const EliminatedPlayers = () => {
  const { game } = useConnectionStore();
  const theme = useMantineTheme();

  // Use test player if no real players are passed
  let displayPlayers = !game
    ? [
        testPlayer,
        testPlayer,
        testPlayer,
        testPlayer,
        testPlayer,
        testPlayer,
        testPlayer,
        testPlayer,
        testPlayer,
      ]
    : game.players.filter((player) => !player.eliminated && player.playedInRound);

  displayPlayers.sort((a, b) => {
    const aLastRound = a.roundHistory[a.roundHistory.length - 1];
    const bLastRound = b.roundHistory[b.roundHistory.length - 1];
    return (aLastRound?.coinsPlayed || 0) - (bLastRound?.coinsPlayed || 0);
  });

  const eliminatedPlayers = game?.players.filter((player) => player.eliminated) || [];
  eliminatedPlayers.sort((a, b) => {
    return a.endRank - b.endRank;
  });

  displayPlayers = [...displayPlayers, ...eliminatedPlayers];

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: "0%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={styles.container}
    >
      <div className={styles.titleContainer}>
        <IconCoins className={styles.coinsIcon} stroke={2} />
        <StaggeredText text="Player Bets" initialDelay={0.4} staggerSpeed={0.02} />
      </div>
      <div className={styles.playersContainer}>
        {displayPlayers.map((player) => {
          const lastRound = player.roundHistory[player.roundHistory.length - 1];
          const isEliminatedInRound = game?.lastRoundResults?.playersEliminated.some(
            (eliminatedPlayer) => eliminatedPlayer.id === player.id
          );

          const isEliminatedBeforeRoun = player.eliminated;

          return (
            <div
              key={player.id}
              className={styles.playerContainer}
              style={
                isEliminatedInRound
                  ? { color: theme.colors.red[6] }
                  : isEliminatedBeforeRoun
                  ? { color: theme.colors.gray[6], opacity: 0.6 }
                  : {}
              }
            >
              <FontAwesomeIcon
                icon={getIcon(player.icon)}
                color={isEliminatedBeforeRoun ? theme.colors.gray[6] : getColor(player.color)}
                className={styles.playerIcon}
              />
              <p>{player.name}</p>
              <div className={styles.playedCoinsContainer}>
                {isEliminatedBeforeRoun ? (
                  <IconNumber className={styles.hashIcon} style={{ color: theme.colors.gray[6] }} />
                ) : (
                  <IconCoinFilled className={styles.coinIcon} />
                )}
                <p>{isEliminatedBeforeRoun ? player.endRank : lastRound.coinsPlayed}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default EliminatedPlayers;
