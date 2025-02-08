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
    },
  ],
  hostId: { type: String, required: true },
  round: { type: Number, default: 1 },
  status: { type: String, default: "waiting" }, // waiting, playing, finished
});

export const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
