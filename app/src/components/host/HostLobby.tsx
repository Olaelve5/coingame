// components/GameRoom.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon, getColor } from "@/utils/iconUtils";
import QRCode from "./QRCode";
import styles from "./styles/HostLobby.module.css";

export default function HostLobby({ gameCode }: { gameCode: string }) {
  const router = useRouter();
  const { game, joinAsHost, cleanup, kickPlayer } = useConnectionStore();
  const { startGame } = useGameplayStore();

  useEffect(() => {
    const initGame = async () => {
      const success = await joinAsHost(gameCode);
      if (!success) {
        router.push("/");
      }
    };

    initGame();
    return () => cleanup();
  }, [gameCode, joinAsHost, router, cleanup]);

  const handleStartGame = async () => {
    const success = await startGame(gameCode);
    if (!success) {
      alert("Failed to start game");
    }
  };

  const handleClickPlayer = (player: any) => {
    // Disconnect player
    const playerKicked = kickPlayer(player.id);

    if (!playerKicked) {
      alert("Failed to disconnect player");
    }
  };

  // Split the game code into two parts, half each
  const gameCodeString = gameCode.slice(0, 3) + " - " + gameCode.slice(3);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h1 className={styles.title}>Cashfall.io</h1>
        <div className={styles.joinContainer}>
          <div className={styles.joinSection}>
            <p className={styles.sectionTitle}>Join by game code</p>
            <h1 className={styles.gameCode}>{gameCodeString}</h1>
          </div>
          <div className={styles.joinSection}>
            <p className={styles.sectionTitle}>...or join by QR code</p>
            <QRCode gameCode={gameCode} />
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.playerCountSection}>
          <div className={styles.playerCount}>
            <h2 className={styles.playerCountNumber}>
              {game?.players.filter((player) => player.connected).length}
            </h2>
            <p className={styles.playerCountText}>players joined</p>
          </div>
          <button
            className={styles.startGameButton}
            onClick={handleStartGame}
            disabled={!game?.players.length || game.players.length < 3}>
            <p>Start</p>
            <IconDeviceGamepad2 size={26} />
          </button>
        </div>

        <ul className={styles.playerGrid}>
          {game?.players
            ?.filter((player) => player.connected)
            ?.map((player) => {
              return (
                <li
                  onClick={() => handleClickPlayer(player)}
                  key={player.id}
                  className={styles.playerItem}>
                  <FontAwesomeIcon
                    icon={getIcon(player.icon)}
                    style={{ color: getColor(player.color) }}
                    size="xl"
                  />
                  <p className={styles.playerName}>{player.name}</p>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
