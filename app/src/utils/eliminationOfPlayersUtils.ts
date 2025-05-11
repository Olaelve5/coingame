import { Player, Game } from "../models/Game";

export const sortPlayersByCoinsPlayed = (game: Game) => {
  if (!game) return [];

  const players = game.players.filter(
    (player) =>
      player.roundHistory &&
      player.roundHistory.length >= game.round &&
      player.roundHistory[game.round - 1] !== undefined &&
      player.roundHistory[game.round - 1].coinsPlayed !== undefined
  );

  return players.sort((a: Player, b: Player) => {
    const aCoins = a.roundHistory[game.round - 1].coinsPlayed || 0;
    const bCoins = b.roundHistory[game.round - 1].coinsPlayed || 0;
    return bCoins - aCoins;
  });
};

interface EliminationResult {
  playersInDanger: Player[];
  safePlayers: Player[];
}

export const findPossibleEliminations = (game: Game): EliminationResult => {
  if (!game) return { safePlayers: [], playersInDanger: [] };

  const players = sortPlayersByCoinsPlayed(game);
  const possibleEliminations: Player[] = [players[players.length - 1]]; // Start with the player with the least coins played

  let minCoinsPlayed =
    players[players.length - 1].roundHistory[game.round - 1].coinsPlayed || 0;

  // add players with the same coins played or the top 3 players with the least coins played
  for (let i = players.length - 2; i >= 0; i--) {
    const currentCoinsPlayed =
      players[i].roundHistory[game.round - 1].coinsPlayed || 0;
    if (
      currentCoinsPlayed === minCoinsPlayed ||
      possibleEliminations.length < 3
    ) {
      possibleEliminations.push(players[i]);
    } else {
      break;
    }
  }

  // Add 2 random players if there are than 4 players
  if (possibleEliminations.length < 4) {
    const remainingPlayers = players.filter(
      (player) => !possibleEliminations.includes(player)
    );
    const randomPlayers = remainingPlayers
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    possibleEliminations.push(...randomPlayers);
  }

  return {
    playersInDanger: possibleEliminations,
    safePlayers: players.filter(
      (player) => !possibleEliminations.includes(player)
    ),
  };
};
