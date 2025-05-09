import Timer from "./Timer";
import PlayerPercentage from "./PlayerPercentage";
import RoundTitle from "./RoundTitle";
import { useState } from "react";
import styles from "../styles/HostGame.module.css";

export default function TestAnimations() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [testingSignal, setTestingSignal] = useState(false);

  return (
    <div className={styles.container}>
      <RoundTitle handleRoundStart={() => console.log("Round started")} />
      <Timer timerRunning={timerRunning} testingSignal={testingSignal} />
      <PlayerPercentage testingSignal={testingSignal} />
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
