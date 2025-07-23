import { IconXboxXFilled, IconCoinFilled } from "@tabler/icons-react";
import styles from "./styles/EliminatedPlayers.module.css";
import { useMantineTheme } from "@mantine/core";
import { Player } from "@/models/Game";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon } from "@/utils/iconUtils";

// Define the props interface
interface EliminatedPlayersProps {
  playersEliminated: Player[];
}

// Correct destructuring
const EliminatedPlayers = ({ playersEliminated }: EliminatedPlayersProps) => {
  const theme = useMantineTheme();

  // Test player for development
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

  // Use test player if no real players are passed
  const displayPlayers = playersEliminated.length === 0 ? [testPlayer] : playersEliminated;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <IconXboxXFilled className={styles.xIcon} color={theme.colors.red[7]} />
        <h1>Eliminated Players</h1>
      </div>
      <div className={styles.playersContainer}>
        {displayPlayers.map((player) => {
          const lastRound = player.roundHistory[player.roundHistory.length - 1];

          return (
            <div key={player.id} className={styles.playerContainer}>
              <FontAwesomeIcon icon={getIcon(player.icon)} className={styles.playerIcon} />
              <p>{player.name}</p>
              <div className={styles.playedCoinsContainer}>
                <IconCoinFilled className={styles.coinIcon} />
                <p>{lastRound?.coinsPlayed ?? 0}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EliminatedPlayers;
