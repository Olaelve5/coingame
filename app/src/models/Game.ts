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
    initialCoins: number; // amount will vary based on the number of players
    fastMode: boolean;
    roundTimeLimit: number; // in seconds - 20, 40 or 60
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
