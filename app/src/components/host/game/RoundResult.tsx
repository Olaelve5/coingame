import StartNewRoundButton from "../StartNewRoundButton";
import { useConnectionStore } from "@/store/connectionStore";

export default function RoundResult() {
  const { game } = useConnectionStore();

  if (!game) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Round Results</h1>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Round: {game.round}</h2>
        <p>Total Coins Played: {game.lastRoundResults.totalCoinsPlayed}</p>
        <p>Minimum Coins Played: {game.lastRoundResults.minCoinsPlayed}</p>
        <p>Players Eliminated:</p>
        <ul>
          {game.lastRoundResults.playersEliminated.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      </div>
      <StartNewRoundButton />
    </div>
  );
}
