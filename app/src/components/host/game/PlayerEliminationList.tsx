import { useConnectionStore } from "@/store/connectionStore";
import { motion } from "framer-motion";
import { sortPlayersByCoinsPlayed } from "@/utils/sortPlayerUtils";
import { useEffect, useMemo, useState } from "react";
import { Player } from "@/models/Game";
import { getIcon, getColor } from "@/utils/iconUtils";

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
  }, []);

  const visiblePlayers = useMemo(() => {
    if (!game || !sortedPlayers.length) return [];

    return sortedPlayers.filter(
      (player) => player.roundHistory[game.round - 1].coinsPlayed >= count
    ).reverse();
  }, [count, sortedPlayers, game]);

  if (!game) return null;

  return (
    <div>
      <ul>
        {visiblePlayers.map((player) => (
          <li key={player.id}>
            {player.name} , {player.roundHistory[game.round - 1].coinsPlayed}
          </li>
        ))}
      </ul>
    </div>
  );
}
