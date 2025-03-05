"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { getIcon, getColor } from "@/utils/iconUtils";
import IconCustomize from "./IconCustomize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "@/components/player/Loader";
import styles from "@/components/player/styles/PlayerLobby.module.css";

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
  const [hasJoined, setHasJoined] = useState(false);
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(true);

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
    <div className={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.innerContainer}>
          <h1 className={styles.heading}>Joined!</h1>
          <div className={styles.playerContainer}>
            <FontAwesomeIcon
              icon={getIcon(icon)}
              style={{ color: getColor(color) }}
              size="3x"
            />
            <p className={styles.playerName}>{playerName}</p>
          </div>
          <IconCustomize
            icon={icon}
            color={color}
            setIcon={setIcon}
            setColor={setColor}
          />
        </div>
      )}
    </div>
  );
}
