const calculateRoundResults = (game) => {
  // Get all active (non-eliminated) players first
  const activePlayers = game.players.filter((player) => !player.eliminated);

  // Get plays for current round
  const currentRoundPlays = activePlayers.map((player) => {
    const roundPlay = player.roundHistory.find((h) => h.round === game.round);
    return {
      playerId: player.id,
      playerName: player.name,
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

  // Find players who played the minimum amount
  const playersEliminated = currentRoundPlays
    .filter((play) => play.coinsPlayed === minCoinsPlayed)
    .map((play) => ({
      id: play.playerId,
      name: play.playerName,
    }));

  return {
    totalCoinsPlayed,
    playersEliminated,
    round: game.round,
    minCoinsPlayed,
  };
};

export { calculateRoundResults };
