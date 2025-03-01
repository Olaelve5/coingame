import { useConnectionStore } from "@/store/connectionStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StartNewRoundButton from "./StartNewRoundButton";

const HostGame = ({ gameCode }: { gameCode: string }) => {
  const { game, joinAsHost, cleanup } = useConnectionStore();
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
      {game?.roundStatus === "completed" && game?.status === "playing" && (
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
          <StartNewRoundButton />
        </>
      )}

      {game?.winner && game.status === "finished" && (
        <>
          <p>
            <br />
            Game finished! Winner: {game.winner.name} with {game.winner.coins}{" "}
            coins left
          </p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/")}>
            Go back to home
          </button>
        </>
      )}
    </div>
  );
};

export default HostGame;
