import React from "react";
import { getIcon, getColor } from "@/utils/iconUtils";
import { Player } from "@/models/Game";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/WaitingForPlayers.module.css";
import PlayerDetails from "./PlayerDetails";
import PlayerIcon from "@/components/host/game/PlayerIcon";

interface WaitingForPlayersProps {
  player: Player;
}

export default function WaitingForPlayers({ player }: WaitingForPlayersProps) {
  const icon = getIcon(player.icon);
  const color = getColor(player.color);

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={icon} color={color} style={{ fontSize: '5rem' }}  />
    </div>
  );
}
