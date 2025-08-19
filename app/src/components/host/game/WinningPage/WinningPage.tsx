import { useConnectionStore } from "@/store/connectionStore";
import styles from "./styles/WinningPage.module.css";
import PlayersAccordion from "./PlayersAccoridion";
import Podium from "./Podium";
import NewGameButton from "./NavigationButtons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AwardsSection from "./AwardsSection";

export default function WinningPage() {
  const { game } = useConnectionStore();
  const [podiumAnimationFinished, setPodiumAnimationFinished] = useState(false);
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPage(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!game) return null;

  if (!showPage) return null;

  return (
    <div className={styles.container}>
      <Podium setPodiumAnimationFinished={setPodiumAnimationFinished} />
      {podiumAnimationFinished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={styles.accordionContainer}
        >
          <PlayersAccordion />
          <AwardsSection />
          {/* <NewGameButton /> */}
        </motion.div>
      )}
    </div>
  );
}
