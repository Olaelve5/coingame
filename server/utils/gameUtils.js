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

  // Sort plays by coins played in ascending order
  currentRoundPlays.sort((a, b) => a.coinsPlayed - b.coinsPlayed);

  // Calculate total coins played
  const totalCoinsPlayed = currentRoundPlays.reduce(
    (sum, play) => sum + play.coinsPlayed,
    0
  );

  let prevPlayerBet = 0;
  let playersEliminated = [];
  const eliminationCount = Math.min(
    activePlayers.length - 1,
    game.gameSettings.elimsPerRound
  );

  for (const play of currentRoundPlays) {
    if (
      playersEliminated.length < eliminationCount ||
      prevPlayerBet === play.coinsPlayed
    ) {
      playersEliminated.push({
        id: play.playerId,
        name: play.playerName,
      });
      prevPlayerBet = play.coinsPlayed;
    } else {
      break;
    }
  }

  const minCoinsPlayed = prevPlayerBet;

  return {
    totalCoinsPlayed,
    playersEliminated,
    round: game.round,
    minCoinsPlayed,
  };
};

export { calculateRoundResults };
