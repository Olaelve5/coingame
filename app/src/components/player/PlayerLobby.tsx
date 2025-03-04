"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import {
  getIcon,
  getColor,
  getNextIcon,
  getNextColor,
} from "@/utils/iconUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "@/components/player/Loader";

export default function PlayerLobby({
  gameCode,
  playerName,
}: {
  gameCode: string;
  playerName: string;
}) {
  const router = useRouter();
  const { joinAsPlayer, cleanup, disconnect, isKicked, game } =
    useConnectionStore();
  const { changeIcon } = useGameplayStore();
  const [hasJoined, setHasJoined] = useState(false);
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to debounce icon/color changes
  const debouncedChangeIcon = (newIcon: string, newColor: string) => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      console.log("Sending update to server:", newIcon, newColor);
      changeIcon(newIcon, newColor);
      debounceTimerRef.current = null;
    }, 500); // 500ms delay
  };

  const handleNextIcon = () => {
    const nextIcon = getNextIcon(icon);
    setIcon(nextIcon); // Update UI immediately
    debouncedChangeIcon(nextIcon, color); // Debounce server update
  };

  const handleNextColor = () => {
    const nextColor = getNextColor(color);
    setColor(nextColor); // Update UI immediately
    debouncedChangeIcon(icon, nextColor); // Debounce server update
  };

  // Clean up the timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!gameCode || !playerName || playerName.trim() === "") {
      return;
    }

    // This effect handles only the join logic
    if (isKicked) {
      router.push("/");
      return;
    }

    if (!hasJoined) {
      const initGame = async () => {
        setLoading(true);
        const success = await joinAsPlayer(gameCode, playerName);
        if (success) {
          setHasJoined(true);
        } else {
          alert("Failed to join game");
          router.push("/");
        }
      };

      initGame();
    }

    return () => {
      if (hasJoined && !isKicked) {
        cleanup();
        disconnect();
      }
    };
  }, [
    gameCode,
    playerName,
    joinAsPlayer,
    cleanup,
    disconnect,
    router,
    isKicked,
    hasJoined,
  ]);

  // Add a separate effect to handle player data updates
  useEffect(() => {
    if (hasJoined && game?.players) {
      const player = game.players.find((p) => p.name === playerName);
      if (player) {
        setIcon(player.icon);
        setColor(player.color);
        setLoading(false);
      }
    }
  }, [game, hasJoined, playerName]);

  return (
    <div className="text-center">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">Game Lobby: {gameCode}</h1>
          <div className="flex justify-center items-center mt-4">
            <FontAwesomeIcon
              icon={getIcon(icon)}
              style={{ color: getColor(color) }}
              size="3x"
            />
            <p className="ml-2 text-lg">{playerName}</p>
          </div>
          <button onClick={handleNextIcon}>Next Icon</button>
          <button onClick={handleNextColor}>Next Color</button>
        </div>
      )}
    </div>
  );
}
