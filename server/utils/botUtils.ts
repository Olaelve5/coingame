import { v4 as uuidv4 } from "uuid";

// Define the icon and color functions with the CORRECT values matching iconUtils.js
function getRandomIcon(): string {
  const icons = [
    "astronaut",
    "dragon",
    "dna",
    "rocket",
    "money",
    "robot",
    "fire",
    "cube",
    "biohazard",
    "knight",
    "volcano",
    "pizza",
  ];
  return icons[Math.floor(Math.random() * icons.length)];
}

function getRandomColor(): string {
  const colors = [
    "red",
    "orangeRed",
    "yellow",
    "chartreuse",
    "green",
    "springGreen",
    "cyan",
    "azure",
    "violet",
    "magenta",
    "rose",
    "white",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function generateTestPlayers() {
  // Fun bot names - 20 creative options
  const botNames = [
    "CoinMaster",
    "WealthHoarder",
    "LuckyCharm",
    "GoldenHand",
    "PennyWise",
    "RichyRich",
    "MoneyMaker",
    "TreasureBot",
    "FortuneSeeker",
    "CashGrabber",
    "CoinCollector",
    "WealthWizard",
    "JackpotJunkie",
    "MidasTouch",
    "TycoonBot",
    "BankRoller",
    "CoinFlipPro",
    "VaultKeeper",
    "BlingKing",
    "PiggyBank",
  ];

  // Generate 20 unique test players
  return botNames.map((name, index) => ({
    id: `test-player-${uuidv4().substring(0, 8)}`,
    name,
    coins: 100, // Starting coins for each player
    connected: true,
    socketId: `test-socket-${index}`,
    eliminated: false,
    playedInRound: false, // Changed to false so they can play in first round
    icon: getRandomIcon(),
    color: getRandomColor(),
    roundHistory: [],
  }));
}
