import { Accordion } from "@mantine/core";
import { useConnectionStore } from "@/store/connectionStore";
import RoundHistoryGraph from "./RoundHistoryGraph";
import { getIcon, getColor } from "@/utils/iconUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles/PlayersAccordion.module.css";
import { useState } from "react";
import {
  IconNumber,
  IconLaurelWreath2,
  IconLaurelWreath1,
  IconLaurelWreath3,
} from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";

const PlayersAccordion = () => {
  const { game } = useConnectionStore();
  const theme = useMantineTheme();
  const players = game?.players.filter((player) => player.endRank != null) || [];
  const [showPlayerBets, setShowPlayerBets] = useState(true);
  const [showAverageCoins, setShowAverageCoins] = useState(false);

  players.sort((a, b) => a.endRank - b.endRank);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <IconLaurelWreath1 size={30} color={theme.colors.yellow[6]} />;
    if (rank === 2) return <IconLaurelWreath2 size={30} color={theme.colors.blue[2]} />;
    if (rank === 3) return <IconLaurelWreath3 size={30} color={theme.colors.orange[6]} />;
    return <IconNumber size={26} color={theme.colors.gray[6]} />;
  };

  const getPlayerColor = (rank: number) => {
    if (rank === 1) return theme.colors.yellow[6];
    if (rank === 2) return theme.colors.blue[2];
    if (rank === 3) return theme.colors.orange[6];
    return theme.colors.gray[0];
  };

  return (
    <div className={styles.container}>
      <h1>Full player list</h1>
      <Accordion
        disableChevronRotation
        variant="filled"
        defaultValue="Apples"
        className={styles.accordion}
        classNames={styles}
        radius="md"
        transitionDuration={200}
      >
        {players.map((player) => (
          <Accordion.Item key={player.id} value={player.name}>
            <Accordion.Control
              icon={
                <FontAwesomeIcon
                  icon={getIcon(player.icon)}
                  color={getColor(player.color)}
                  className={styles.playerIcon}
                />
              }
              chevron={
                <div className={styles.chevron}>
                  {getRankIcon(player.endRank)}
                  {player.endRank > 3 ? <span>{player.endRank}</span> : null}
                </div>
              }
              className={styles.accordionControl}
            >
              <div className={styles.playerRow}>
                <h2 style={{ color: getPlayerColor(player.endRank) }}>{player.name}</h2>
              </div>
            </Accordion.Control>
            <Accordion.Panel classNames={{ content: styles.panelContent }}>
              <RoundHistoryGraph
                player={player}
                showPlayerBets={showPlayerBets}
                showAverageCoins={showAverageCoins}
                setShowPlayerBets={setShowPlayerBets}
                setShowAverageCoins={setShowAverageCoins}
              />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default PlayersAccordion;
