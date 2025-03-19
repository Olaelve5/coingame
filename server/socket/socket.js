import { connectionSocketHandler } from "./connectionSocket.js";
import { roundManageSocketHandler } from "./roundManageSocket.js";
import { gameplaySocketHandler } from "./gameplaySocket.js";
import BotManager from "../utils/botManager.js";

const socketHandler = (io) => {
  const botManager = new BotManager(io);

  connectionSocketHandler(io);
  gameplaySocketHandler(io);
  roundManageSocketHandler(io, botManager);

  // Listen for game updates that might trigger bot plays
  io.on("connection", (socket) => {
    socket.on("gameUpdate", (game) => {
      botManager.handleGameUpdate(game);
    });

    socket.on("roundStart", (gameCode) => {
      // When a round starts, handle potential bot plays
      Game.findOne({ gameCode }).then((game) => {
        if (game) botManager.handleGameUpdate(game);
      });
    });

    socket.on("gameEnd", (gameCode) => {
      botManager.cleanup(gameCode);
    });
  });
};

export { socketHandler };
