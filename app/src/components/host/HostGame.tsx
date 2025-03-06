import { useConnectionStore } from "@/store/connectionStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Timer from "./timer/Timer";
import PlayerPercentage from "./PlayerPercentage";
import PlayersIconGrid from "./PlayersIconGrid";
import StartNewRoundButton from "./StartNewRoundButton";
import styles from "./styles/HostGame.module.css";

const HostGame = ({ gameCode }: { gameCode: string }) => {
  const { game, joinAsHost, cleanup } = useConnectionStore();
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

  return (
    <div>
      <Timer />
      <PlayerPercentage />
      <PlayersIconGrid />
    </div>
  );
};

export default HostGame;
