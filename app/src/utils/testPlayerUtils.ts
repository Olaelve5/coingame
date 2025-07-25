import { Player } from "@/models/Game";

export // Test player for development
  const testPlayer: Player = {
    id: "test-player-1",
    name: "TestPlayer123",
    coins: 5,
    connected: false,
    socketId: "test-socket",
    eliminated: true,
    playedInRound: true,
    icon: "dragon",
    color: "violet",
    roundHistory: [
      {
        round: 1,
        coinsPlayed: 5,
      },
    ],
  };