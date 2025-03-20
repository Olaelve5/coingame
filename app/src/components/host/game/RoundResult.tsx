import StartNewRoundButton from "../StartNewRoundButton";
import { useConnectionStore } from "@/store/connectionStore";
import CoinsCountdown from "./CoinsCountdown";
import { useState, useEffect } from "react";
import { Player } from "@/models/Game";

export default function RoundResult() {
  const { game } = useConnectionStore();
  const [count, setCount] = useState(100);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);

  const sortPlayersByCoinsPlayed = (players: Player[]) => {
    if (!game || !players) return [];

    return players.sort((a: Player, b: Player) => {
      const aCoins = a.roundHistory[game.round - 1].coinsPlayed || 0;
      const bCoins = b.roundHistory[game.round - 1].coinsPlayed || 0;
      return bCoins - aCoins;
    });
  };

  useEffect(() => {
    setIsCountdownRunning(true);
    console.log("Starting countdown");

    if (game) {
      const playersAlive = game.players.filter((player) => !player.eliminated);
      const sorted = sortPlayersByCoinsPlayed(playersAlive);
      setSortedPlayers(sorted);
    }
  }, []);

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
        <p>Total Coins Played: {game.lastRoundResults.totalCoinsPlayed}</p>
        <p>Minimum Coins Played: {game.lastRoundResults.minCoinsPlayed}</p>
        <p>Players Eliminated:</p>
        <ul>
          {sortedPlayers.map((player) => (
            <li key={player.id}>
              {player.name} , {player.roundHistory[game.round - 1].coinsPlayed}
            </li>
          ))}
        </ul>
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
