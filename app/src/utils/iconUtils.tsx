import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faOtter,
  faDragon,
  faGhost,
  faCalculator,
  faRocket,
  faUserAstronaut,
  faSackDollar,
  faFireFlameCurved,
  faRobot,
  faDna,
  faCube,
  faVolcano,
  faPizzaSlice,
} from "@fortawesome/free-solid-svg-icons";

const colors = {
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  lime: "#BFFF00",
  yellow: "#FFFF00",
  pink: "#FF69B4",
  coral: "#FF7F50",
  orange: "#FFA500",
  gold: "#FFD700",
  violet: "#EE82EE",
  turquoise: "#40E0D0",
  neonGreen: "#39FF14",
  hotPink: "#e8002e",
};

const icons = {
  otter: faOtter,
  dragon: faDragon,
  ghost: faGhost,
  calculator: faCalculator,
  rocket: faRocket,
  astronaut: faUserAstronaut,
  money: faSackDollar,
  fire: faFireFlameCurved,
  robot: faRobot,
  dna: faDna,
  cube: faCube,
  volcano: faVolcano,
  pizza: faPizzaSlice,
};

export const getRandomIconKey = () => {
  const iconNames = Object.keys(icons);
  const randomIconName =
    iconNames[Math.floor(Math.random() * iconNames.length)];
  return randomIconName;
};

export const getRandomColorKey = () => {
  const colorNames = Object.keys(colors);
  const randomColorName =
    colorNames[Math.floor(Math.random() * colorNames.length)];
  return randomColorName;
};

export const getIcon = (iconName: string) => {
  const icon = icons[iconName as keyof typeof icons];
  if (!icon) {
    console.error(`Icon ${iconName} not found`);
    return icons["otter"]; // default icon
  }
  return icon;
};

export const getColor = (colorName: string) => {
  const color = colors[colorName as keyof typeof colors];
  if (!color) {
    console.error(`Color ${colorName} not found`);
    return colors["cyan"]; // default color
  }
  return color;
};

export const getNextIcon = (iconName: string) => {
  const iconNames = Object.keys(icons);
  const currentIndex = iconNames.indexOf(iconName);
  const nextIndex = (currentIndex + 1) % iconNames.length;
  return iconNames[nextIndex];
};

export const getNextColor = (colorName: string) => {
  const colorNames = Object.keys(colors);
  const currentIndex = colorNames.indexOf(colorName);
  const nextIndex = (currentIndex + 1) % colorNames.length;
  return colorNames[nextIndex];
};
