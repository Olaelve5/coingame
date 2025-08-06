import Timer from "./Timer";
import PlayerPercentage from "./PlayerPercentage";
import { useState } from "react";
import styles from "../styles/HostGame.module.css";
import PlayerIcon from "./PlayerIcon";
import EliminationReport from "./EliminationReport/EliminationReport";

export default function TestAnimations() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [testingSignal, setTestingSignal] = useState(false);

  return (
    <div
      className={styles.container}
      style={{ overflow: "hidden", position: "relative", maxHeight: "100vh" }}
    >
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
            endRank: 3,
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
        style={{ position: "absolute", top: "0px", left: "0px" }}
        onClick={() => {
          setTestingSignal(!testingSignal);
        }}
      >
        End round
      </button>
      {testingSignal && <EliminationReport handleRoundPreparation={function (): void {
        throw new Error("Function not implemented.");
      } } />}
    </div>
  );
}
