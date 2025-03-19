import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  gameCode: { type: String, required: true, unique: true },
  players: [
    {
      id: String,
      name: String,
      coins: Number,
      connected: Boolean,
      socketId: String,
      eliminated: Boolean,
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
  roundStatus: { type: String, default: "preparing" }, // preparing, active, completed
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
    coins: Number,
    roundHistory: [
      {
        round: Number,
        coinsPlayed: Number,
      },
    ],
  },
});

export const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
