import {
  faChessKnight,
  faDragon,
  faBiohazard,
  faBolt,
  faRocket,
  faUserAstronaut,
  faFireFlameCurved,
  faRobot,
  faDna,
  faCube,
  faVolcano,
  faPizzaSlice,
} from "@fortawesome/free-solid-svg-icons";

import { DEFAULT_THEME } from "@mantine/core";

export const colors = {
  red: DEFAULT_THEME.colors.red[5], // hsl(0, 100%, 60%)
  orangeRed: DEFAULT_THEME.colors.orange[5], // hsl(30, 100%, 60%)
  yellow: DEFAULT_THEME.colors.yellow[5], // hsl(60, 100%, 60%)
  chartreuse: DEFAULT_THEME.colors.lime[5], // hsl(90, 100%, 60%)
  green: DEFAULT_THEME.colors.green[5], // hsl(120, 100%, 60%)
  springGreen: DEFAULT_THEME.colors.teal[4], // hsl(160, 100%, 60%)
  cyan: DEFAULT_THEME.colors.cyan[4], // hsl(180, 100%, 60%)
  azure: DEFAULT_THEME.colors.indigo[5], // hsl(210, 100%, 60%)
  violet: DEFAULT_THEME.colors.violet[5], // hsl(270, 100%, 60%)
  magenta: DEFAULT_THEME.colors.grape[5], // hsl(300, 100%, 60%)
  rose: DEFAULT_THEME.colors.pink[5], // hsl(330, 100%, 60%)
  white: "#FFFFFF", // White
};

export const icons = {
  astronaut: faUserAstronaut,
  dragon: faDragon,
  dna: faDna,
  rocket: faRocket,
  money: faBolt,
  robot: faRobot,
  fire: faFireFlameCurved,
  cube: faCube,
  biohazard: faBiohazard,
  knight: faChessKnight,
  volcano: faVolcano,
  pizza: faPizzaSlice,
};

export const getRandomIconKey = () => {
  const iconNames = Object.keys(icons);
  const randomIconName = iconNames[Math.floor(Math.random() * iconNames.length)];
  return randomIconName;
};

export const getRandomColorKey = () => {
  const colorNames = Object.keys(colors);
  const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];
  return randomColorName;
};

export const getIcon = (iconName: string) => {
  const icon = icons[iconName as keyof typeof icons];
  if (!icon) {
    console.error(`Icon ${iconName} not found`);
    return icons["astronaut"]; // default icon
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
