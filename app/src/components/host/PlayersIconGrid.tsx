import styles from "./styles/PlayersIconGrid.module.css";
import { useConnectionStore } from "@/store/connectionStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon, getColor } from "@/utils/iconUtils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Player } from "@/models/Game";

export default function PlayersIconGrid() {
  const { game } = useConnectionStore();
  const players =
    game?.players.filter(
      (player) => !player.eliminated && player.playedInRound
    ) || [];

  // Store player positions
  const [playerPositions, setPlayerPositions] = useState<{
    [id: string]: { row: number; col: number };
  }>({});

  const rows = 12;
  const columns = 18;

  useEffect(() => {
    if (!game || players.length === 0) return;

    // Check if we need to assign new positions
    const unpositionedPlayers = players.filter((p) => !playerPositions[p.id]);

    if (unpositionedPlayers.length === 0) return;
    // Create a pool of all grid positions
    const allPositions: { row: number; col: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (row > 1 && row < 11 && col > 5 && col < 13) continue;
        allPositions.push({ row, col });
      }
    }

    // Shuffle all positions
    const shuffledPositions = [...allPositions].sort(() => Math.random() - 0.5);

    // Create a copy of existing positions
    const newPositions = { ...playerPositions };

    // Assign positions to unpositioned players
    unpositionedPlayers.forEach((player, index) => {
      if (index < shuffledPositions.length) {
        newPositions[player.id] = shuffledPositions[index];
      }
    });

    setPlayerPositions(newPositions);
  }, [game, players, playerPositions]);

  if (!game) {
    return null;
  }

  // Function to generate CSS grid position
  const getGridPosition = (player: Player) => {
    const pos = playerPositions[player.id];
    if (!pos) return {}; // Default positioning if not assigned

    return {
      gridRow: pos.row + 1, // +1 because grid lines start at 1, not 0
      gridColumn: pos.col + 1,
    };
  };

  return (
    <div className={styles.container}>
      {players.map((player, index) => {
        const icon = getIcon(player.icon);
        return (
          <motion.div
            key={player.id}
            className={styles.iconContainer}
            style={getGridPosition(player)}
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: "spring", bounce: 0.5 }}>
            <FontAwesomeIcon
              icon={icon}
              size="2x"
              color={getColor(player.color)}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
