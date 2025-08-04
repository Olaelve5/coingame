export interface Player {
  id: string;
  name: string;
  coins: number;
  connected: boolean;
  socketId: string;
  eliminated: boolean;
  endRank: number;
  playedInRound: boolean;
  icon: string;
  color: string;
  roundHistory: {
    round: number;
    coinsPlayed: number;
  }[];
}
interface EliminatedPlayer {
  id: string;
  name: string;
}

interface LastRoundResults {
  playersEliminated: EliminatedPlayer[];
  totalCoinsPlayed: number;
  round: number;
  minCoinsPlayed: number;
}

interface Winner {
  id: string;
  name: string;
}

export interface Game {
  _id: string;
  gameCode: string;
  players: Player[];
  hostId: string;
  round: number;
  roundStatus: "preparing" | "completed" | "active" | "eliminating";
  lastRoundResults: LastRoundResults;
  status: "waiting" | "playing" | "finished";
  winner?: Winner; // Optional since it's only present when game is finished
}
