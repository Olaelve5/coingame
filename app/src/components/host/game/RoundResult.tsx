import StartNewRoundButton from "../StartNewRoundButton";
import { useConnectionStore } from "@/store/connectionStore";
import CoinsCountdown from "./CoinsCountdown";
import PlayerEliminationList from "./PlayerEliminationList";
import { useState, useEffect } from "react";

export default function RoundResult() {
  const { game } = useConnectionStore();
  const [count, setCount] = useState(100);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  useEffect(() => {
    if (game) {
      setIsCountdownRunning(true);
    }
  }, [game]);

  if (!game) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Round {game.round} results</h1>
      <CoinsCountdown
        count={count}
        setCount={setCount}
        isCountdownRunning={isCountdownRunning}
      />
      <div className="mb-4">
        <PlayerEliminationList count={count} />
      </div>
      <StartNewRoundButton />
    </div>
  );
}
