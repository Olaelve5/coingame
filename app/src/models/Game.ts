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
interface PlayerMention {
  id: string;
  name: string;
}

interface LastRoundResults {
  playersEliminated: PlayerMention[];
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
  roundStatus: "preparing" | "completed" | "active" | "eliminating";
  elimsPerRound: number;
  lastRoundResults: LastRoundResults;
  status: "waiting" | "playing" | "finished";
  winner?: PlayerMention; // Optional since it's only present when game is finished
}
