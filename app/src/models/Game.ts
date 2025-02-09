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

export interface Game {
  _id: string;
  gameCode: string;
  players: Player[];
  hostId: string;
  round: number;
  roundStatus: "completed" | "active";
  lastRoundResults: LastRoundResults;
  status: "waiting" | "playing" | "finished";
}
