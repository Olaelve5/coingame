import { useGameStore } from "@/store/gameStore";

const HostGame = () => {
  const { game } = useGameStore();
  return (
    <div>
      <h1>Game is playing</h1>
      <p>Game code: {game?.gameCode}</p>
      <p>Players:</p>
      <ul>
        {game?.players?.map((player) => (
          <li key={player.id}>
            {player.name} - Coins: {player.coins}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HostGame;
