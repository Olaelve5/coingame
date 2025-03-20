import { useConnectionStore } from "@/store/connectionStore";
import { motion, AnimatePresence } from "framer-motion";
import { sortPlayersByCoinsPlayed } from "@/utils/sortPlayerUtils";
import { useEffect, useMemo, useState } from "react";
import { Player } from "@/models/Game";
import { getIcon, getColor } from "@/utils/iconUtils";
import styles from "../styles/PlayerEliminationList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconCoinFilled } from "@tabler/icons-react";

interface PlayerEliminationListProps {
  count: number;
}

export default function PlayerEliminationList({
  count,
}: PlayerEliminationListProps) {
  const { game } = useConnectionStore();
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (game) {
      // To get ALL players who participated in this round (including eliminated ones)
      const playersInRound = game.players.filter((player) => {
        // Check if the player has an entry for this round
        return (
          player.roundHistory &&
          player.roundHistory.length >= game.round &&
          player.roundHistory[game.round - 1] !== undefined
        );
      });
      const sorted = sortPlayersByCoinsPlayed(game, playersInRound);
      setSortedPlayers(sorted);
    }
  }, [game]);

  const visiblePlayers = useMemo(() => {
    if (!game || !sortedPlayers.length) return [];

    return sortedPlayers
      .filter(
        (player) => player.roundHistory[game.round - 1].coinsPlayed >= count
      )
      .reverse();
  }, [count, sortedPlayers, game]);

  // Calculate current minimum among VISIBLE players only
  const currentVisibleMinimum = useMemo(() => {
    if (!game || !visiblePlayers.length) return Number.POSITIVE_INFINITY;

    return Math.min(
      ...visiblePlayers.map(
        (player) => player.roundHistory[game.round - 1].coinsPlayed
      )
    );
  }, [visiblePlayers, game]);

  if (!game) return null;

  return (
    <div className={styles.container}>
      <AnimatePresence>
        <ul className={styles.playerList}>
          {visiblePlayers.map((player, index) => {
            const playerCoins = player.roundHistory[game.round - 1].coinsPlayed;
            const isCurrentLowest = playerCoins === currentVisibleMinimum;

            return (
              <motion.li
                key={player.id}
                layout // This is crucial - it handles position changes automatically
                initial={{ opacity: 0, height: 0, x: -200 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  x: 0,
                }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  opacity: { duration: 0.2 },
                }}>
                <motion.div
                  className={
                    isCurrentLowest
                      ? styles.playerContainerLowest
                      : styles.playerContainer
                  }>
                  <div className={styles.iconNameContainer}>
                    <FontAwesomeIcon
                      icon={getIcon(player.icon)}
                      color={getColor(player.color)}
                    />
                    <h2>{player.name}</h2>
                  </div>
                  <div className={styles.coinsPlayedContainer}>
                    <h2>{playerCoins}</h2>
                    <IconCoinFilled size="1.8rem" className={styles.coinIcon} />
                  </div>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </AnimatePresence>
    </div>
  );
}
