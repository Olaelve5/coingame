import { Game } from "../models/Game.ts";
import { calculateRoundResults } from "../utils/gameUtils.js";

export const handleRoundEnd = async (gameCode) => {
  console.log(`Ending round for game ${gameCode}`);
  const game = await Game.findOne({ gameCode });
  if (!game) throw new Error("Game not found");

  const roundResults = calculateRoundResults(game);

  // Store results but dont update game status yet
  return Game.findOneAndUpdate(
    { gameCode },
    {
      $set: {
        roundStatus: "eliminating", // Show elimination report
        lastRoundResults: roundResults,
      },
    },
    { new: true }
  );
};

export const executeEliminations = async (gameCode) => {
  const game = await Game.findOne({ gameCode });
  if (!game || !game.lastRoundResults) throw new Error("Game not found");

  const playersEliminated = game.lastRoundResults.playersEliminated;

  // Count and find active players after elimination
  const remainingPlayers = game.players.filter(
    (p) =>
      !p.eliminated &&
      !playersEliminated.find((eliminated) => eliminated.id === p.id)
  );

  const isGameOver = remainingPlayers.length <= 1;
  const winner = isGameOver ? remainingPlayers[0] : null;

  return Game.findOneAndUpdate(
    { gameCode },
    {
      $set: {
        "players.$[elem].eliminated": true,
        ...(isGameOver && {
          status: "finished",
          winner: {
            id: winner.id,
            name: winner.name,
            coins: winner.coins,
            roundHistory: winner.roundHistory,
          },
        }),
      },
    },
    {
      new: true,
      arrayFilters: [
        { "elem.id": { $in: playersEliminated.map((p) => p.id) } },
      ],
    }
  );
};
