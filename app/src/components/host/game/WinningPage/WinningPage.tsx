import { useConnectionStore } from "@/store/connectionStore";
import styles from "./styles/WinningPage.module.css";
import PlayersAccordion from "./PlayersAccoridion";
import Podium from "./Podium";
import Confetti from "@/components/host/game/WinningPage/Confetti";
import { useState, useEffect, use } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import AwardsSection from "./AwardsSection";
import PodiumButtons from "./PodiumButtons";

export default function WinningPage() {
  const { game } = useConnectionStore();
  const [animateConfetti, setAnimateConfetti] = useState(false);
  const [podiumAnimationFinished, setPodiumAnimationFinished] = useState(false);
  const { scrollYProgress } = useScroll();
  const [showPage, setShowPage] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (podiumAnimationFinished && latest < 0.02) {
      setAnimateConfetti(true);
    } else {
      setAnimateConfetti(false);
    }
  });

  useEffect(() => {
    if (podiumAnimationFinished) {
      setAnimateConfetti(true);
      // Remove body no-scroll
      document.body.style.overflow = "auto";
    } else {
      // Set body no-scroll
      document.body.style.overflow = "hidden";
    }
  }, [podiumAnimationFinished]);

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
      <div className={styles.podiumSection}>
        <Podium setPodiumAnimationFinished={setPodiumAnimationFinished} />
        <PodiumButtons showButtons={podiumAnimationFinished} />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={styles.accordionContainer}
      >
        <PlayersAccordion />
        <AwardsSection />
      </motion.div>
    </div>
  );
}
