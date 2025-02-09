const calculateRoundResults = (game) => {
  // Get plays for current round
  const currentRoundPlays = game.players.map((player) => {
    const roundPlay = player.roundHistory.find((h) => h.round === game.round);
    return {
      playerId: player.id,
      coinsPlayed: roundPlay ? roundPlay.coinsPlayed : 0,
    };
  });

  // Calculate total coins played
  const totalCoinsPlayed = currentRoundPlays.reduce(
    (sum, play) => sum + play.coinsPlayed,
    0
  );

  // Find minimum coins played
  const minCoinsPlayed = Math.min(
    ...currentRoundPlays.map((play) => play.coinsPlayed)
  );

  // Find all players who played the minimum amount
  const playersEliminated = game.players
    .filter((player) => {
      const roundPlay = player.roundHistory.find((h) => h.round === game.round);
      return roundPlay && roundPlay.coinsPlayed === minCoinsPlayed;
    })
    .map((player) => player.id);

  return {
    totalCoinsPlayed,
    playersEliminated,
    round: game.round,
    minCoinsPlayed, 
  };
};

export { calculateRoundResults };
