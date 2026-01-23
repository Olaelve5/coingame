import { IconCoins, IconCoinFilled, IconNumber } from "@tabler/icons-react";
import styles from "./styles/EliminatedPlayers.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getColor, getIcon } from "@/utils/iconUtils";
import { motion } from "framer-motion";
import { useConnectionStore } from "@/store/connectionStore";
import { StaggeredText } from "../../StaggeredText";
import { useMantineTheme } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";

// Correct destructuring
const EliminatedPlayers = () => {
  const { game } = useConnectionStore();
  const theme = useMantineTheme();

  // Use test player if no real players are passed
  let displayPlayers =
    game?.players.filter((player) => !player.eliminated && player.playedInRound) || [];

  displayPlayers.sort((a, b) => {
    const aLastRound = a.roundHistory[a.roundHistory.length - 1];
    const bLastRound = b.roundHistory[b.roundHistory.length - 1];
    return (aLastRound?.coinsPlayed || 0) - (bLastRound?.coinsPlayed || 0);
  });

  const eliminatedPlayers = game?.players.filter((player) => player.eliminated) || [];
  eliminatedPlayers.sort((a, b) => {
    return a.endRank - b.endRank;
  });

  const eliminatedThisRound = game?.lastRoundResults?.playersEliminated || [];

  displayPlayers = [...displayPlayers, ...eliminatedPlayers];

  // Insert the line right between active + eliminated
  const relegationLineIndex = eliminatedThisRound.length;

  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 0.6 }}
      className={styles.container}
    >
      <div className={styles.titleContainer}>
        {/* <IconCoins className={styles.coinsIcon} stroke={2} /> */}
        <StaggeredText text="Player Bets" initialDelay={0.4} staggerSpeed={0.02} />
      </div>
      <div className={styles.playersContainer}>
        {displayPlayers.map((player, index) => {
          const lastRound = player.roundHistory[player.roundHistory.length - 1];
          const isEliminatedInRound = eliminatedThisRound.some(
            (eliminatedPlayer) => eliminatedPlayer.id === player.id
          );

          const isEliminatedBeforeRound = player.eliminated;

          return (
            <Fragment key={player.id}>
              {index === relegationLineIndex && (
                <div className={styles.relegationLine} aria-hidden="true" />
              )}

              <motion.div
                className={styles.playerContainer}
                style={
                  isEliminatedInRound
                    ? { color: theme.colors.red[6] }
                    : isEliminatedBeforeRound
                      ? { color: theme.colors.gray[7], opacity: 0.6 }
                      : {}
                }
              >
                <FontAwesomeIcon
                  icon={getIcon(player.icon)}
                  color={isEliminatedBeforeRound ? theme.colors.gray[7] : getColor(player.color)}
                  className={styles.playerIcon}
                />
                <p>{player.name}</p>
                <div className={styles.playedCoinsContainer}>
                  {isEliminatedBeforeRound ? (
                    <IconNumber
                      className={styles.hashIcon}
                      style={{ color: theme.colors.gray[7] }}
                    />
                  ) : (
                    <IconCoinFilled className={styles.coinIcon} />
                  )}
                  <p>{isEliminatedBeforeRound ? player.endRank : lastRound.coinsPlayed}</p>
                </div>
              </motion.div>
            </Fragment>
          );
        })}
      </div>
    </motion.div>
  );
};

export default EliminatedPlayers;
