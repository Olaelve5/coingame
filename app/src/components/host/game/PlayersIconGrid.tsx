import styles from "../styles/PlayersIconGrid.module.css";
import { useConnectionStore } from "@/store/connectionStore";
import PlayerIcon from "./PlayerIcon";
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

    // Create a copy of existing positions
    const newPositions = { ...playerPositions };

    // Track which positions are already occupied
    const occupiedPositions = new Set();

    // Mark current positions as occupied
    Object.values(newPositions).forEach((pos) => {
      occupiedPositions.add(`${pos.row},${pos.col}`);
    });

    // Create a pool of available positions
    const availablePositions: { row: number; col: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (col > 5 && col < 13) continue;
        const posKey = `${row},${col}`;
        if (!occupiedPositions.has(posKey)) {
          availablePositions.push({ row, col });
        }
      }
    }

    // Shuffle available positions
    const shuffledPositions = [...availablePositions].sort(
      () => Math.random() - 0.5
    );

    // Find unpositioned players
    const unpositionedPlayers = players.filter((p) => !playerPositions[p.id]);

    // Assign positions to unpositioned players
    unpositionedPlayers.forEach((player, index) => {
      if (index < shuffledPositions.length) {
        newPositions[player.id] = shuffledPositions[index];
      } else {
        // If we run out of positions, create fallback positions
        console.warn("More players than available positions");
        newPositions[player.id] = {
          row: Math.floor(Math.random() * rows),
          col: Math.floor(Math.random() * columns),
        };
      }
    });

    // Remove positions for players no longer in the game
    const currentPlayerIds = new Set(players.map((p) => p.id));
    Object.keys(newPositions).forEach((id) => {
      if (!currentPlayerIds.has(id)) {
        delete newPositions[id];
      }
    });

    setPlayerPositions(newPositions);
  }, [game, players]);

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
        return (
          <PlayerIcon
            key={player.id}
            player={player}
            index={index}
            gridPosition={getGridPosition(player)}
          />
        );
      })}
    </div>
  );
}
