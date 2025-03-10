import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Timer from "./Timer";
import PlayerPercentage from "../PlayerPercentage";
import PlayersIconGrid from "./PlayersIconGrid";
import StartNewRoundButton from "../StartNewRoundButton";
import styles from "../styles/HostGame.module.css";
import { motion } from "framer-motion";
import { roundTitleAnimation } from "@/utils/animationUtils";
import RoundTitle from "./RoundTitle";

const HostGame = ({ gameCode }: { gameCode: string }) => {
  const { game, joinAsHost, cleanup } = useConnectionStore();
  const { endRound } = useGameplayStore();
  const router = useRouter();
  const [titleAnimationFinished, setTitleAnimationFinished] = useState(false);

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
      <RoundTitle
        titleAnimationFinished={titleAnimationFinished}
        setTitleAnimationFinished={setTitleAnimationFinished}
        />
      <motion.div>
        <Timer onTimeUp={endRound} />
      </motion.div>
      <motion.div>
        <PlayerPercentage />
      </motion.div>
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
