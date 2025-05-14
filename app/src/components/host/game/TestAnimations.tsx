import Timer from "./Timer";
import PlayerPercentage from "./PlayerPercentage";
import RoundTitle from "./RoundTitle";
import { useState } from "react";
import styles from "../styles/HostGame.module.css";
import PlayerIcon from "./PlayerIcon";

export default function TestAnimations() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [testingSignal, setTestingSignal] = useState(false);

  return (
    <div className={styles.container}>
      <RoundTitle handleRoundStart={() => console.log("Round started")} />
      <Timer timerRunning={timerRunning} testingSignal={testingSignal} />
      <PlayerPercentage testingSignal={testingSignal} />
      <div style={{ position: "absolute", top: "100px", right: "100px" }}>
        <PlayerIcon
          player={{
            id: "1",
            name: "Player 1",
            color: "cyan",
            roundHistory: [],
            playedInRound: true,
            eliminated: false,
            coins: 0,
            connected: false,
            socketId: "",
            icon: "dragon",
          }}
          index={1}
          gridPosition={{ gridRow: 1, gridColumn: 1 }}
          testingSignal={testingSignal} 
        />
      </div>
      <button
        style={{ position: "absolute", top: "10px", left: "10px" }}
        onClick={() => {
          setTestingSignal(!testingSignal);
        }}>
        End round
      </button>
    </div>
  );
}
