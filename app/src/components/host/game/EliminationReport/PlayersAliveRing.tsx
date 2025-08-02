import { RingProgress } from "@mantine/core";
import { StaggeredText } from "../../StaggeredText";
import { useMantineTheme } from "@mantine/core";
import styles from "./styles/RoundStats.module.css";
import { IconUserX } from "@tabler/icons-react";
import { useConnectionStore } from "@/store/connectionStore";

const PlayersAliveRing = () => {
  const theme = useMantineTheme();
  const { game } = useConnectionStore();

  const newEliminations = game?.lastRoundResults?.playersEliminated.length || 0;
  const oldEliminationCount = game?.players.filter((player) => player.eliminated).length || 0;
  const totalPlayers = game?.players.length || 0; // Default to 0 if no players are available

  const totalEliminations = newEliminations + oldEliminationCount;
  return (
    <div className={styles.ringContainer}>
      <div className={styles.titleContainer}>
        <IconUserX className={styles.chartIcon} size={30} />
        <StaggeredText text="Players Eliminated" initialDelay={0.4} staggerSpeed={0.02} />
      </div>
      <RingProgress
        sections={[
          {
            value: (totalEliminations / totalPlayers) * 100,
            color: theme.colors.blue[4],
          },
        ]}
        label={
          <div style={{ textAlign: "center" }}>
            <p>
              {totalEliminations}/{totalPlayers}
            </p>
          </div>
        }
        size={200}
        thickness={20}
        transitionDuration={1000}
        roundCaps
        rootColor="rgb(52, 55, 61)"
      />
    </div>
  );
};

export default PlayersAliveRing;
