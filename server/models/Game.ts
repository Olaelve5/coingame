import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  gameCode: { type: String, required: true, unique: true },
  gameSettings: {
    initialCoins: { type: Number, default: 100 }, // amount will vary based on the number of players
    fastMode: { type: Boolean, default: false },
    roundTimeLimit: { type: Number, default: 40 }, // in seconds - 20, 40 or 60
    elimsPerRound: { type: Number, default: 1 },
  },
  players: [
    {
      id: String,
      name: String,
      coins: Number,
      connected: Boolean,
      socketId: String,
      eliminated: Boolean,
      endRank: { type: Number, default: null },
      playedInRound: Boolean,
      icon: String,
      color: String,
      roundHistory: [
        {
          round: Number,
          coinsPlayed: Number,
        },
      ],
    },
  ],
  host: {
    id: { type: String, required: true },
    socketId: { type: String, required: true },
  },
  round: { type: Number, default: 0 },
  roundStatus: { type: String, default: "preparing" }, // preparing, active, completed, eliminating
  lastRoundResults: {
    playersEliminated: [
      {
        id: String,
        name: String,
      },
    ],
    totalCoinsPlayed: Number,
    round: Number,
    minCoinsPlayed: Number,
  },
  status: { type: String, default: "waiting" }, // waiting, playing, finished
  winner: {
    id: String,
    name: String,
  },
});

export const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
