import styles from "../styles/PlayersIconGrid.module.css";
import { useConnectionStore } from "@/store/connectionStore";
import PlayerIcon from "./PlayerIcon";
import { useEffect, useState, useRef, use } from "react";
import { Player } from "@/models/Game";
import { findPossibleEliminations } from "@/utils/eliminationOfPlayersUtils";

interface PlayersIconGridProps {
  startEliminationAnimations?: boolean;
  setPlayerAnimationsFinished: (finished: boolean) => void;
}

export default function PlayersIconGrid({
  startEliminationAnimations,
  setPlayerAnimationsFinished,
}: PlayersIconGridProps) {
  const { game } = useConnectionStore();

  const [completedExitAnimations, setCompletedExitAnimations] = useState<Set<string>>(new Set());
  const [allPlayersAnimatedOut, setAllPlayersAnimatedOut] = useState(false);
  const playersToAnimateOutRef = useRef<Player[]>([]);

  const players =
    game?.players.filter((player) => !player.eliminated && player.playedInRound) || [];

  const [playerPositions, setPlayerPositions] = useState<{
    [id: string]: { row: number; col: number };
  }>({});

  const rows = 12;
  const columns = 18;

  // Use a ref to track player IDs already positioned
  const positionedPlayersRef = useRef(new Set());

  useEffect(() => {
    if (!game || players.length === 0) return;

    const gameCode = game.gameCode;

    // Get current player IDs
    const currentPlayerIds = new Set(players.map((p) => p.id));

    // Only update positions if there are players that need positioning
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
    const shuffledPositions = [...availablePositions].sort(() => Math.random() - 0.5);

    // Find unpositioned players
    const unpositionedPlayers = players.filter((p) => !playerPositions[p.id]);

    // Assign positions to unpositioned players
    unpositionedPlayers.forEach((player, index) => {
      if (index < shuffledPositions.length) {
        newPositions[player.id] = shuffledPositions[index];
        positionedPlayersRef.current.add(player.id);
      } else {
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
    if (!pos)
      return {
        position: "relative",
      }; // Default positioning if not assigned

    return {
      position: "relative",
      gridRow: pos.row + 1, // +1 because grid lines start at 1, not 0
      gridColumn: pos.col + 1,
    };
  };

  useEffect(() => {
    if (startEliminationAnimations && game) {
      setPlayerAnimationsFinished(false);
      setCompletedExitAnimations(new Set());
      playersToAnimateOutRef.current = game.players.filter((player) => !player.eliminated);
    }
  }, [startEliminationAnimations]);

  const handlePlayerAnimationComplete = (playerId: string) => {
    setCompletedExitAnimations((prevCompleted) => {
      const newCompleted = new Set(prevCompleted);
      newCompleted.add(playerId);

      // Check if all players that were supposed to animate out have done so
      const expectedToAnimateCount = playersToAnimateOutRef.current.length;
      if (expectedToAnimateCount > 0 && newCompleted.size === expectedToAnimateCount) {
        setAllPlayersAnimatedOut(true);
      }
      return newCompleted;
    });
  };

  useEffect(() => {
    if (allPlayersAnimatedOut) {
      setPlayerAnimationsFinished(true);
    }
  }, [allPlayersAnimatedOut, setPlayerAnimationsFinished]);

  return (
    <div className={styles.container}>
      {players.map((player, index) => {
        if (!playerPositions[player.id]) {
          return null; // Skip rendering if position is not assigned
        }

        return (
          <PlayerIcon
            key={player.id}
            player={player}
            index={index}
            shouldAnimateOut={startEliminationAnimations}
            gridPosition={getGridPosition(player)}
            animationDelay={0.5 + index * 0.1}
            onAnimationComplete={handlePlayerAnimationComplete}
          />
        );
      })}
    </div>
  );
}
