"use client";

import { IconUserPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import PinInput from "./PinInput";
import { useEffect, useRef, useState } from "react";
import styles from "./styles/JoinGameButton.module.css";
import { getApiBaseUrl } from "@/utils/apiUrlUtils";

const JoinGameButton = () => {
  const router = useRouter();
  const [showPinInput, setShowPinInput] = useState(false);
  const [gameCode, setGameCode] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleShowPinInput = () => {
    setShowPinInput(true);
  };

  const handleJoinGame = async () => {
    if (gameCode.length < 6) {
      alert("Please enter a valid game code");
      return;
    }

    try {
      setIsLoading(true);

      const baseUrl = getApiBaseUrl();

      // 1. Verify game exists
      const gameResponse = await fetch(`${baseUrl}/games/${gameCode}`);

      if (!gameResponse.ok) {
        setErrorMessage("Game not found");
        return;
      }

      const gameData = await gameResponse.json();
      if (gameData.status !== "waiting") {
        setErrorMessage("Game is in progress");
        return;
      }

      setErrorMessage("");

      console.log("Joining game", gameCode);

      // 3. Navigate to game room
      router.push(`/join/${gameCode}`);
    } catch (error) {
      console.error("Join game failed:", error);
      alert(
        "Failed to join game. Please check the code and try again." + error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setErrorMessage("");

    if (gameCode.length === 6) {
      buttonRef.current?.focus();
    }
  }, [gameCode]);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.pinInputContainer} ${
          showPinInput ? styles.pinInputVisible : styles.pinInputHidden
        }`}>
        <PinInput showPinInput={showPinInput} onChange={setGameCode} />
      </div>
      <button
        ref={buttonRef}
        onClick={showPinInput ? handleJoinGame : handleShowPinInput}
        disabled={showPinInput && gameCode.length < 6}
        className={`${styles.joinGameButton} ${
          showPinInput ? styles.buttonExpanded : ""
        }`}>
        <div className={styles.buttonContent}>
          <span className={styles.buttonText}>
            {showPinInput ? "Join game" : "Join with code"}
          </span>
          <IconUserPlus size={26} />
        </div>
      </button>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default JoinGameButton;
