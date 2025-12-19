import { useEffect, useState, useRef } from "react";
import { Player } from "@/models/Game";
import PlayerIcon from "./PlayerIcon";

interface PlayerShuffleProps {
  players: Player[];
  targetPlayerId: string;
  duration: number; // in seconds
  onComplete?: () => void;
}

export default function PlayerShuffle({
  players,
  targetPlayerId,
  duration,
  onComplete,
}: PlayerShuffleProps) {
  const [displayedPlayer, setDisplayedPlayer] = useState<Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!players || players.length === 0) return;

    // Start shuffling
    const shuffleInterval = 100; // ms

    const pickRandomPlayer = () => {
      const randomIndex = Math.floor(Math.random() * players.length);
      const randomPlayer = players[randomIndex];
      // Ensure we don't pick the same one twice in a row if possible (and if >1 player)
      setDisplayedPlayer((prev) => {
        if (players.length > 1 && prev?.id === randomPlayer.id) {
          // Pick next one
          return players[(randomIndex + 1) % players.length];
        }
        return randomPlayer;
      });
    };

    // Initial pick
    pickRandomPlayer();

    intervalRef.current = setInterval(pickRandomPlayer, shuffleInterval);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const target = players.find((p) => p.id === targetPlayerId);
      if (target) {
        setDisplayedPlayer(target);
      }
      if (onComplete) onComplete();
    }, duration * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [players, targetPlayerId, duration, onComplete]);

  if (!displayedPlayer) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <PlayerIcon
        player={displayedPlayer}
        index={0}
        gridPosition={{}}
        skipEntryAnimation={true}
      />
    </div>
  );
}
