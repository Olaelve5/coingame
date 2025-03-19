import { useGameplayStore } from "@/store/gameplayStore";

const StartNewRoundButton = () => {
  const { startRound, prepareRound } = useGameplayStore();

  const handleStartRound = () => {
    prepareRound();
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
