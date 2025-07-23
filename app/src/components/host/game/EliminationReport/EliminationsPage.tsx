import EliminatedPlayers from "./EliminatedPlayers";
import CoinsCountdown from "../CoinsCountdown";
import { useState } from "react";

const EliminationsPage = ({ showCountdown }: { showCountdown: boolean }) => {
  if (showCountdown) {
    return (
      <CoinsCountdown
        targetNumber={0}
        isRunning={true}
        onComplete={() => console.log("Countdown completed")}
      />
    );
  }

  return <EliminatedPlayers playersEliminated={[]} />;
};

export default EliminationsPage;
