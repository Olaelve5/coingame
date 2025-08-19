import {
  IconBrain,
  IconBoltFilled,
  IconTargetArrow,
  IconScale,
  IconCreditCardFilled,
  IconDotsVertical,
  IconDots,
} from "@tabler/icons-react";
import styles from "./styles/AwardsSection.module.css";
import { useMantineTheme } from "@mantine/core";

const AwardsSection = () => {
  const theme = useMantineTheme();

  return (
    <div className={styles.container}>
      <IconDotsVertical size={24} color={theme.colors.gray[4]} />
      <div className={styles.awardList}>
        <div className={styles.awardRow}>
          <div className={styles.awardItem}>
            <div className={styles.iconContainer}>
              <div
                className={styles.iconGlow}
                style={{ "--shadow-color": theme.colors.pink[5] } as React.CSSProperties}
              ></div>
              <IconBrain color={theme.colors.pink[5]} size={36} />
            </div>
            <span>The Mastermind</span>
            <p className={styles.awardDescription}>
              Takes their time to calculate every move. Strategy over speed.
            </p>
          </div>

          <div className={styles.awardItem}>
            <div className={styles.iconContainer}>
              <div
                className={styles.iconGlow}
                style={{ "--shadow-color": theme.colors.yellow[5] } as React.CSSProperties}
              ></div>
              <IconBoltFilled color={theme.colors.yellow[5]} size={36} />
            </div>
            <span>The Quick Draw</span>
            <p className={styles.awardDescription}>
              Lightning-fast decisions. Acts on instinct and never hesitates.
            </p>
          </div>

          <div className={styles.awardItem}>
            <div className={styles.iconContainer}>
              <div
                className={styles.iconGlow}
                style={{ "--shadow-color": theme.colors.orange[5] } as React.CSSProperties}
              ></div>
              <IconTargetArrow color={theme.colors.orange[5]} size={36} />
            </div>
            <span>The Cliffhanger</span>
            <p className={styles.awardDescription}>
              Lives dangerously close to elimination but always survives.
            </p>
          </div>
        </div>

        <div className={styles.awardRow}>
          <div className={styles.awardItem}>
            <div className={styles.iconContainer}>
              <div
                className={styles.iconGlow}
                style={{ "--shadow-color": theme.colors.blue[4] } as React.CSSProperties}
              ></div>
              <IconScale color={theme.colors.blue[4]} size={36} />
            </div>
            <span>The Steady Hand</span>
            <p className={styles.awardDescription}>
              Consistent and reliable. Keeps their betting pattern steady.
            </p>
          </div>

          <div className={styles.awardItem}>
            <div className={styles.iconContainer}>
              <div
                className={styles.iconGlow}
                style={{ "--shadow-color": theme.colors.green[5] } as React.CSSProperties}
              ></div>
              <IconCreditCardFilled color={theme.colors.green[5]} size={36} />
            </div>
            <span>The High Roller</span>
            <p className={styles.awardDescription}>
              Goes big or goes home. Makes the boldest bets of the game.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardsSection;
