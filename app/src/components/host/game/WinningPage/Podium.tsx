import styles from "./styles/Podium.module.css";
import { getIcon, getColor } from "@/utils/iconUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMantineTheme } from "@mantine/core";
import { useConnectionStore } from "@/store/connectionStore";

const Podium = () => {
  const theme = useMantineTheme();
  const { game } = useConnectionStore();

  if (!game) return null;

  const podium = {
    firstPlace: game.players.find((player) => player.endRank === 1),
    secondPlace: game.players.find((player) => player.endRank === 2),
    thirdPlace: game.players.find((player) => player.endRank === 3),
  };

  return (
    <div className={styles.container}>
      <h1>Final Standings</h1>
      <div className={styles.podiumContainer}>
        <div className={styles.standContainer}>
          <FontAwesomeIcon
            icon={getIcon(podium.secondPlace?.icon || "dragon")}
            color={getColor(podium.secondPlace?.color || "cyan")}
            className={styles.icon}
          />
          <div
            className={styles.stand}
            style={{
              height: "175px",
              backgroundColor: theme.colors.blue[7],
              border: `3px solid ${theme.colors.blue[7]}`,
            }}
          >
            2
          </div>
        </div>
        <div className={styles.standContainer}>
          <FontAwesomeIcon
            icon={getIcon(podium.firstPlace?.icon || "dragon")}
            color={getColor(podium.firstPlace?.color || "cyan")}
            className={styles.icon}
          />
          <div
            className={styles.stand}
            style={{
              height: "250px",
              backgroundColor: theme.colors.yellow[7],
              border: `3px solid ${theme.colors.yellow[7]}`,
            }}
          >
            1
          </div>
        </div>
        <div className={styles.standContainer}>
          <FontAwesomeIcon
            icon={getIcon(podium.thirdPlace?.icon || "dragon")}
            color={getColor(podium.thirdPlace?.color || "cyan")}
            className={styles.icon}
          />
          <div
            className={styles.stand}
            style={{
              height: "100px",
              backgroundColor: theme.colors.orange[7],
              border: `3px solid ${theme.colors.orange[7]}`,
            }}
          >
            3
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podium;
