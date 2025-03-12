// components/CreateGameButton.tsx
"use client";
import { useRouter } from "next/navigation";
import getPlayerId from "@/utils/getPlayerId";
import { useConnectionStore } from "@/store/connectionStore";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import styles from "./styles/CreateGameButton.module.css";

export default function CreateGameButton() {
  const router = useRouter();
  const { prepareForNewGame } = useConnectionStore();

  const onCreateGame = async () => {
    try {
      // 1. Generate game code
      const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const hostId = getPlayerId();

      // Prepare for new game (clean up existing listeners and connection)
      prepareForNewGame();

      // 2. Create game via POST
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameCode,
            players: [], // Start with empty players array
            host: { id: hostId, socketId: "pending" },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create game");

      // 3. Store host details
      sessionStorage.setItem("playerName", "Host");
      sessionStorage.setItem("hostId", hostId);

      // 4. Navigate to game room
      router.push(`/host/${gameCode}`);
    } catch (error) {
      console.error("Create game failed:", error);
      alert("Failed to create game. Please try again.");
    }
  };

  return (
    <button onClick={onCreateGame} className={styles.createGameButton}>
      <div className={styles.buttonContent}>
        <span className={styles.buttonText}>Host game</span>
        <IconDeviceGamepad2 size={26} />
      </div>
    </button>
  );
}
