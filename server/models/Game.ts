import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  gameCode: { type: String, required: true, unique: true },
  gameSettings: {
    initialCoins: { type: String, default: "medium" },
    fastMode: { type: Boolean, default: false },
    roundTimeLimit: { type: Number, default: 30 }, // in seconds - 20, 40 or 60
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
      awards: [
        {
          id: {
            type: String,
            enum: [
              "mastermind",
              "quick_draw",
              "high_roller",
              "cliffhanger",
              "steady_hand",
            ],
            required: true,
          },
          insight: {
            type: String,
            required: true,
          },
        },
      ],
      roundHistory: [
        {
          round: Number,
          coinsPlayed: Number,
          timeSpent: Number, // in milliseconds
          closeCall: Boolean, // true if the player was close to elimination
        },
      ],
    },
  ],
  host: {
    id: { type: String, required: true },
    socketId: { type: String, required: true },
  },
  round: { type: Number, default: 0 },
  roundStartedAt: { type: Date, default: null },
  roundStatus: { type: String, default: "preparing" }, // preparing, active, completed, eliminating
  initialBudget: { type: Number, default: 0 },
  rounds: [
    {
      playersEliminated: [
        {
          id: String,
          name: String,
        },
      ],
      round: Number,
      totalCoinsPlayed: Number,
      averageCoinsPlayed: Number,
      averageCoinsLeft: Number,
      safeCoinsAmount: Number,
    },
  ],
  status: { type: String, default: "waiting" }, // waiting, playing, finished
});

GameSchema.virtual("lastRoundResults").get(function () {
  // Return the last round from the rounds array
  return this.rounds.length > 0 ? this.rounds[this.rounds.length - 1] : null;
});

GameSchema.set("toJSON", { virtuals: true });

export const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
