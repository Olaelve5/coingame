import styles from "../styles/PlayersIconGrid.module.css";
import { useConnectionStore } from "@/store/connectionStore";
import PlayerIcon from "./PlayerIcon";
import { useEffect, useState, useRef } from "react";
import { Player } from "@/models/Game";
import { findPossibleEliminations } from "@/utils/eliminationOfPlayersUtils";

interface PlayersIconGridProps {
  startEliminationAnimations?: boolean;
}

export default function PlayersIconGrid({
  startEliminationAnimations,
}: PlayersIconGridProps) {
  const { game } = useConnectionStore();
  const [safePlayers, setSafePlayers] = useState<Player[]>([]);
  const [playersInDanger, setPlayersInDanger] = useState<Player[]>([]);

  const players =
    game?.players.filter(
      (player) => !player.eliminated && player.playedInRound
    ) || [];

  const [playerPositions, setPlayerPositions] = useState<{
    [id: string]: { row: number; col: number };
  }>({});

  const rows = 12;
  const columns = 18;

  // Use a ref to track player IDs we've already positioned
  const positionedPlayersRef = useRef(new Set());

  useEffect(() => {
    if (!game || players.length === 0) return;

    const gameCode = game.gameCode;

    // Get current player IDs
    const currentPlayerIds = new Set(players.map((p) => p.id));

    // Only update positions if we have new players or game changed
    const needsUpdate =
      players.some((p) => !positionedPlayersRef.current.has(p.id)) ||
      Object.keys(playerPositions).some((id) => !currentPlayerIds.has(id));

    if (!needsUpdate) return;

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
        positionedPlayersRef.current.add(player.id);
      } else {
        // If we run out of positions, create fallback positions
        console.warn("More players than available positions");
        newPositions[player.id] = {
          row: Math.floor(Math.random() * rows),
          col: Math.floor(Math.random() * columns),
        };
        positionedPlayersRef.current.add(player.id);
      }
    });

    // Remove positions for players no longer in the game
    Object.keys(newPositions).forEach((id) => {
      if (!currentPlayerIds.has(id)) {
        delete newPositions[id];
        positionedPlayersRef.current.delete(id);
      }
    });

    setPlayerPositions(newPositions);
  }, [game?.gameCode, players]);

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

  useEffect(() => {
    if (startEliminationAnimations) {
      const { safePlayers, playersInDanger } = findPossibleEliminations(game);
      setSafePlayers(safePlayers);
      setPlayersInDanger(playersInDanger);
    }
  }, [startEliminationAnimations]);

  return (
    <div className={styles.container}>
      {players.map((player, index) => {
        return (
          <PlayerIcon
            key={player.id}
            player={player}
            index={index}
            gridPosition={getGridPosition(player)}
            playerIsSafe={safePlayers.some((p) => p.id === player.id)}
            playerIsInDanger={playersInDanger.some((p) => p.id === player.id)}
            animationDelay={0.5 + index * 0.2}
          />
        );
      })}
    </div>
  );
}
