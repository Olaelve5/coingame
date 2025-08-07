// components/GameRoom.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon, getColor } from "@/utils/iconUtils";
import { motion } from "framer-motion";
import QRCode from "./QRCode";
import SettingsPopup from "./SettingsPopup";
import styles from "./styles/HostLobby.module.css";
import { Button } from "@mantine/core";

export default function HostLobby({ gameCode }: { gameCode: string }) {
  const router = useRouter();
  const { game, joinAsHost, cleanup, kickPlayer } = useConnectionStore();
  const { prepareRound } = useGameplayStore();
  const [isExiting, setIsExiting] = useState(false);
  const [playersAnimationComplete, setPlayersAnimationComplete] = useState(false);

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

  const handleStartGameClick = () => {
    setIsExiting(true);
  };

  const handleStartGame = async () => {
    const success = await prepareRound(gameCode);
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
      <motion.div
        animate={
          isExiting && playersAnimationComplete ? { opacity: 1, x: "-100%" } : { opacity: 1, x: 0 }
        }
        transition={{ duration: 0.25, ease: "easeInOut", delay: 0 }}
        onAnimationComplete={() => {
          if (isExiting && playersAnimationComplete) {
            handleStartGame();
          }
        }}
        className={styles.sidebar}
      >
        <h1 className={styles.title}>Cashfall.io</h1>
        <div className={styles.joinContainer}>
          <div className={styles.joinSection}>
            <p className={styles.sectionTitle}>Join by game code</p>
            <motion.h1
              initial={{ scale: 0, rotate: 15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                mass: 0.8,
              }}
              className={styles.gameCode}
            >
              {gameCodeString}
            </motion.h1>
          </div>
          <div className={styles.joinSection}>
            <p className={styles.sectionTitle}>...or join by QR code</p>
            <motion.div
              initial={{ scale: 0, rotate: 15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                mass: 0.8,
              }}
              className={styles.qrCodeContainer}
            >
              <QRCode gameCode={gameCode} />
            </motion.div>
          </div>
        </div>
        <SettingsPopup />
      </motion.div>

      <div className={styles.rightSection}>
        <motion.div
          animate={{ y: isExiting && playersAnimationComplete ? "-100%" : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut", delay: 0 }}
          className={styles.playerCountSection}
        >
          <div className={styles.playerCount}>
            <h2 className={styles.playerCountNumber}>
              {game?.players.filter((player) => player.connected).length}
            </h2>
            <p className={styles.playerCountText}>players joined</p>
          </div>
          <Button
            className={styles.startGameButton}
            size="lg"
            onClick={handleStartGameClick}
            disabled={!game?.players.length || game.players.length < 3}
            rightSection={<IconPlayerPlayFilled size={24} />}
          >
            <p>Start</p>
          </Button>
        </motion.div>

        <ul className={styles.playerGrid}>
          {game?.players
            ?.filter((player) => player.connected)
            ?.map((player, index) => {
              const isLastPlayer = index === 0;
              return (
                <motion.li
                  key={player.id}
                  initial={{ scale: 0, rotate: 15 }}
                  animate={isExiting ? { opacity: 0, y: -100 } : { scale: 1, rotate: 0 }}
                  transition={
                    isExiting
                      ? {
                          delay: 0.05 * (game.players.length - index),
                          duration: 0.25,
                          ease: "easeInOut",
                        }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                          mass: 0.8,
                        }
                  }
                  onAnimationComplete={() => {
                    if (isExiting && isLastPlayer) {
                      setPlayersAnimationComplete(true);
                    }
                  }}
                  className={styles.playerListItem}
                >
                  <div onClick={() => handleClickPlayer(player)} className={styles.playerItem}>
                    <FontAwesomeIcon
                      icon={getIcon(player.icon)}
                      style={{ color: getColor(player.color) }}
                      size="xl"
                    />
                    <p className={styles.playerName}>{player.name}</p>
                  </div>
                </motion.li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
