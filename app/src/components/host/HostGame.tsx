import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StartNewRoundButton from "./StartNewRoundButton";

const HostGame = ({ gameCode }: { gameCode: string }) => {
  const { game, joinAsHost, cleanup } = useGameStore();
  const router = useRouter();

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

  return (
    <div>
      <h1>Game is playing</h1>
      <p>Game code: {game?.gameCode}</p>
      <p>Players:</p>
      <ul>
        {game?.players?.map((player) => (
          <li key={player.id}>
            {player.name} - Played: {player.playedInRound ? "✅" : ""}
            <br />
            {player.connected ? "Connected" : "Disconnected"}
          </li>
        ))}
      </ul>
      {game?.roundStatus === "completed" && (
        <>
          <p>Round {game.round} is completed</p>
          <p>Results:</p>
          <p>
            Players eliminated:{" "}
            {game.lastRoundResults.playersEliminated
              .map((player) => player.name)
              .join(", ")}
          </p>
          <p>Total coins played: {game.lastRoundResults.totalCoinsPlayed}</p>
          <p>Minimum coins played: {game.lastRoundResults.minCoinsPlayed}</p>
          <br />
          <StartNewRoundButton/>
        </>
      )}
    </div>
  );
};

export default HostGame;
