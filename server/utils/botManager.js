import { Game } from "../models/Game.ts";

class BotManager {
  constructor(io) {
    this.io = io;
    this.timers = new Map(); // Track timers for different games
    this.botPlaying = new Set(); // Track which bots are currently playing
    this.strategies = ["agressive", "safe", "balanced"]; // Different playstyles
  }

  // Check if player is a bot
  isBot(playerId) {
    return playerId.startsWith("test-player-");
  }

  // Handle game state updates
  async handleGameUpdate(game) {
    if (!game || game.status !== "playing") return;

    // Only proceed if the round is active
    if (game.roundStatus !== "active") return;

    // Find bots that still need to play
    const botsToPlay = game.players.filter(
      (player) =>
        this.isBot(player.id) && 
        !player.eliminated && 
        !player.playedInRound && 
        !this.botPlaying.has(player.id) 
    );

    if (botsToPlay.length === 0) return; // No bots need to play

    // Clear existing timer for this game if it exists
    this.clearGameTimer(game.gameCode);

    // Schedule bot plays with a delay
    this.timers.set(
      game.gameCode,
      setTimeout(
        () => this.playBotsInGame(game, botsToPlay),
        this.getRandomDelay(1000, 3000) // Wait 1-3 seconds before bots play
      )
    );
  }

  // Clear any existing timer for a game
  clearGameTimer(gameCode) {
    if (this.timers.has(gameCode)) {
      clearTimeout(this.timers.get(gameCode));
      this.timers.delete(gameCode);
    }
  }

  // Get a random delay within a range
  getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Make bots play in a game
  async playBotsInGame(game, bots) {
    console.log(`Making ${bots.length} bots play in game ${game.gameCode}`);

    // Play one by one with slight delays to look natural
    for (const bot of bots) {
      // Check if the bot is still in a valid state to play
      const currentGame = await Game.findOne({ gameCode: game.gameCode });
      if (!currentGame) continue;

      const currentBot = currentGame.players.find((p) => p.id === bot.id);
      if (!currentBot || currentBot.eliminated || currentBot.playedInRound)
        continue;

      // Mark this bot as currently playing to avoid duplicate plays
      this.botPlaying.add(bot.id);

      // Decide how many coins to play using a strategy
      const coinsToPlay = this.decideBotCoins(currentBot);

      // Execute the play after a short random delay
      setTimeout(async () => {
        try {
          await this.executePlay(game.gameCode, bot.id, coinsToPlay);
        } finally {
          // Make sure to remove from playing set even if an error occurs
          this.botPlaying.delete(bot.id);
        }
      }, this.getRandomDelay(500, 15000));
    }
  }

  // Decide how many coins the bot should play
  decideBotCoins(bot) {
    // Get a random strategy for this play
    const strategy =
      this.strategies[Math.floor(Math.random() * this.strategies.length)];

    switch (strategy) {
      case "agressive":
        // Play low number of coins (1-5)
        return Math.min(bot.coins, Math.floor(Math.random() * 5) + 1);

      case "safe":
        // Play higher number of coins (50-80% of what we have)
        const min = Math.floor(bot.coins * 0.5);
        const max = Math.floor(bot.coins * 0.8);
        return Math.min(
          bot.coins,
          Math.floor(Math.random() * (max - min + 1)) + min
        );

      case "balanced":
      default:
        // Play a medium amount (20-50% of what we have)
        return Math.min(
          bot.coins,
          Math.max(1, Math.floor(bot.coins * (0.2 + Math.random() * 0.3)))
        );
    }
  }

  // Execute a bot's play by emitting the same event a player would
  // Replace the executePlay method with this:
  async executePlay(gameCode, botId, coins) {
    console.log(`Bot ${botId} is playing ${coins} coins in game ${gameCode}`);

    try {
      // Instead of emitting an event, directly call the database update functions
      const currentGame = await Game.findOne({ gameCode });
      if (!currentGame) {
        console.error(`Game ${gameCode} not found`);
        return;
      }

      const player = currentGame.players.find((p) => p.id === botId);
      if (!player || player.eliminated || player.playedInRound) {
        console.log(
          `Bot ${botId} can't play: eliminated=${player?.eliminated}, played=${player?.playedInRound}`
        );
        return;
      }

      const timeSpent =
        Date.now() - new Date(currentGame.roundStartedAt).getTime();

      // Update player coins directly
      const updatedGame = await Game.findOneAndUpdate(
        {
          gameCode,
          "players.id": botId,
        },
        {
          $inc: { "players.$.coins": -coins },
          $set: { "players.$.playedInRound": true },
          $push: {
            "players.$.roundHistory": {
              round: currentGame.round,
              coinsPlayed: coins,
              timeSpent,
            },
          },
        },
        { new: true }
      );

      console.log(`Bot ${botId} successfully played ${coins} coins`);

      // Notify all clients of the game update
      this.io.to(gameCode).emit("gameUpdate", updatedGame);
    } catch (error) {
      console.error(`Error executing bot play: ${error.message}`);
    }
  }

  // Clean up resources when a game ends
  cleanup(gameCode) {
    this.clearGameTimer(gameCode);
  }
}

export default BotManager;
