import {Game} from "../models/Game.ts";
import { calculateRoundResults } from "../utils/gameUtils.js";

export const handleRoundEnd = async (gameCode, updatedGame) => {
  const roundResults = calculateRoundResults(updatedGame);
  const playersEliminated = roundResults.playersEliminated;

  // Count and find active players after elimination
  const remainingPlayers = updatedGame.players.filter(
    (p) =>
      !p.eliminated &&
      !playersEliminated.find((eliminated) => eliminated.id === p.id)
  );

  const isGameOver = remainingPlayers.length === 1;
  const winner = isGameOver ? remainingPlayers[0] : null;

  return Game.findOneAndUpdate(
    { gameCode },
    {
      $set: {
        roundStatus: "completed",
        lastRoundResults: roundResults,
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
