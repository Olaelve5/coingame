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
  awards: Award[];
  roundHistory: {
    round: number;
    coinsPlayed: number;
    timeSpent: number; // in milliseconds
    closeCall: boolean; // true if the player was close to elimination
  }[];
}

interface PlayerMention {
  id: string;
  name: string;
}

interface LastRoundResults {
  playersEliminated: PlayerMention[];
  round: number;
  totalCoinsPlayed: number;
  averageCoinsPlayed: number;
  averageCoinsLeft: number;
  safeCoinsAmount: number;
}

export type AwardID = "mastermind" | "quick_draw" | "high_roller" | "cliffhanger" | "steady_hand";

export interface Award {
  id: AwardID;
  insight: string;
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
  rounds: LastRoundResults[];
  initialBudget: number;
  status: "waiting" | "playing" | "finished";
  winner?: PlayerMention; // Optional since it's only present when game is finished
}
