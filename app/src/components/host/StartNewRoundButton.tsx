import { useGameplayStore } from "@/store/gameplayStore";
import { useConnectionStore } from "@/store/connectionStore";

const StartNewRoundButton = () => {
  const { prepareRound } = useGameplayStore();
  const { game } = useConnectionStore();

  if (!game) return null;

  const handleStartRound = () => {
    prepareRound(game.gameCode);
  };

  return (
    <button
      onClick={handleStartRound}
      className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200">
      Start Next Round
    </button>
  );
};

export default StartNewRoundButton;
