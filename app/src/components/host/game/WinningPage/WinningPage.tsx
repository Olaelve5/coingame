import { useConnectionStore } from "@/store/connectionStore";
import styles from "./styles/WinningPage.module.css";
import PlayersAccordion from "./PlayersAccoridion";
import Podium from "./Podium";
import NewGameButton from "./NavigationButtons";
import Confetti from "@/components/host/game/WinningPage/Confetti";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import AwardsSection from "./AwardsSection";
import ShowFullResultButton from "./ShowFullResultButton";

export default function WinningPage() {
  const { game } = useConnectionStore();
  const [animateConfetti, setAnimateConfetti] = useState(false);
  const [showFullList, setShowFullList] = useState(false);
  const { scrollYProgress } = useScroll();
  const [showPage, setShowPage] = useState(false);

  const handleShowFullResults = () => {
    setShowFullList(true);
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (showFullList && latest < 0.01) {
      setAnimateConfetti(true);
    } else {
      setAnimateConfetti(false);
    }
  });

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
      <Confetti animateConfetti={animateConfetti} />
      <Podium setPodiumAnimationFinished={setAnimateConfetti} shouldAnimateUp={showFullList} />
      {!showFullList && animateConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "8rem" }}
        >
          <ShowFullResultButton onClick={handleShowFullResults} />
        </motion.div>
      )}

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
    </div>
  );
}
