import { Player, Game } from "../models/Game";

export const sortPlayersByCoinsPlayed = (game: Game, players: Player[]) => {
  if (!game || !players) return [];

  return players.sort((a: Player, b: Player) => {
    const aCoins = a.roundHistory[game.round - 1].coinsPlayed || 0;
    const bCoins = b.roundHistory[game.round - 1].coinsPlayed || 0;
    return bCoins - aCoins;
  });
};
