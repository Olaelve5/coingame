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
  gameSettings: {
    initialCoins: string; // low, medium or high
    fastMode: boolean;
    roundTimeLimit: number; // in seconds - 20, 30 or 40
    elimsPerRound: number;
  };
  players: Player[];
  hostId: string;
  round: number;
  roundStatus: "preparing" | "completed" | "active" | "eliminating";
  lastRoundResults: LastRoundResults;
  status: "waiting" | "playing" | "finished";
  winner?: PlayerMention; // Optional since it's only present when game is finished
}
