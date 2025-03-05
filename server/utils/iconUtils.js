const iconNames = [
  "astronaut",
  "dragon",
  "dna",
  "rocket",
  "money",
  "robot",
  "fire",
  "cube",
  "biohazard",
  "knight",
  "volcano",
  "pizza",
];

const colorNames = [
  "red",
  "orangeRed",
  "yellow",
  "chartreuse",
  "green",
  "springGreen",
  "cyan",
  "azure",
  "violet",
  "magenta",
  "rose",
  "white",
];

export const getRandomIcon = () => {
  return iconNames[Math.floor(Math.random() * iconNames.length)];
};

export const getRandomColor = () => {
  return colorNames[Math.floor(Math.random() * colorNames.length)];
};
