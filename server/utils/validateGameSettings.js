const validateGameSettings = (gameSettings, playerCount) => {
  const validInitialCoins = ["low", "medium", "high"];
  const validFastMode = [true, false];
  const validRoundTimeLimit = [20, 30, 40];
  const errors = [];

  if (!gameSettings || typeof gameSettings !== "object") {
    errors.push("Invalid game settings");
  }

  if (!validInitialCoins.includes(gameSettings.initialCoins)) {
    errors.push(
      `Invalid initialCoins setting - was ${gameSettings.initialCoins}`
    );
  }

  if (!validFastMode.includes(gameSettings.fastMode)) {
    errors.push(`Invalid fastMode setting - was ${gameSettings.fastMode}`);
  }

  if (!validRoundTimeLimit.includes(gameSettings.roundTimeLimit)) {
    errors.push(
      `Invalid roundTimeLimit setting - was ${gameSettings.roundTimeLimit}`
    );
  }

  if (
    gameSettings.elimsPerRound < 1 ||
    gameSettings.elimsPerRound > playerCount - 2
  ) {
    errors.push(
      `Invalid elimsPerRound setting - was ${gameSettings.elimsPerRound}`
    );
  }

  return { valid: errors.length === 0, errors };
};

export default validateGameSettings;
