interface Player {
  id: string;
  name: string;
  coins: number;
  connected: boolean;
  socketId: string;
  eliminated: boolean;
  playedInRound: boolean;
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
  coins: number;
  roundHistory: {
    round: number;
    coinsPlayed: number;
  }[];
}

export interface Game {
  _id: string;
  gameCode: string;
  players: Player[];
  hostId: string;
  round: number;
  roundStatus: "completed" | "active";
  lastRoundResults: LastRoundResults;
  status: "waiting" | "playing" | "finished";
  winner?: Winner; // Optional since it's only present when game is finished
}
