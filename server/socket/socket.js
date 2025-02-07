import { connectionSocketHandler } from "./connectionSocket.js";
import { gameplaySocketHandler } from "./gameplaySocket.js";

const socketHandler = (io) => {
  connectionSocketHandler(io);
  gameplaySocketHandler(io);
};

export { socketHandler };
