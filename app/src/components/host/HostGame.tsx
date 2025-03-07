import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Timer from "./timer/Timer";
import PlayerPercentage from "./PlayerPercentage";
import PlayersIconGrid from "./PlayersIconGrid";
import StartNewRoundButton from "./StartNewRoundButton";
import styles from "./styles/HostGame.module.css";

const HostGame = ({ gameCode }: { gameCode: string }) => {
  const { game, joinAsHost, cleanup } = useConnectionStore();
  const { endRound } = useGameplayStore();
  const router = useRouter();

  useEffect(() => {
    const initGame = async () => {
      const success = await joinAsHost(gameCode);
      if (!success) {
        router.push("/");
      }
    };

    initGame();
    return () => cleanup();
  }, [gameCode, joinAsHost, router, cleanup]);

  if (!game) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Round {game.round}</h2>
      <Timer onTimeUp={endRound}/>
      <PlayerPercentage />
      <PlayersIconGrid />
      {game.round > 0 && game.roundStatus === "completed" && (
        <div className={styles.buttonContainer}>
          <StartNewRoundButton />
        </div>
      )}
    </div>
  );
};

export default HostGame;
