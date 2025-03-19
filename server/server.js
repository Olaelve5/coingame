// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./db/connect.ts";
import { Game } from "./models/Game.ts";
import { socketHandler } from "./socket/socket.js";
import { generateTestPlayers } from "./utils/botUtils.ts";


const app = express();
const httpServer = createServer(app);

// CORS Configuration
app.use(
  cors({
    origin: "*", // Now safe to use wildcard
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false, // Disable credentials
  })
);

app.options("*", cors()); // Handle preflight requests

// Socket.io Configuration
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());

// Start the server
const startServer = async () => {
  try {
    await connectDB(); // Use your existing connection function
    httpServer.listen(3001, "0.0.0.0", () => {
      console.log("Server running on http://localhost:3001");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Attach the socket.io handler
socketHandler(io);

app.post("/games", async (req, res) => {
  try {
    const newGame = new Game(req.body);

    // Add test players if requested OR in development mode
    const shouldAddTestPlayers =
      req.query.addTestPlayers === "true" ||
      process.env.NODE_ENV === "development";

    if (shouldAddTestPlayers) {
      const testPlayers = generateTestPlayers();
      newGame.players = [...(newGame.players || []), ...testPlayers];
    }

    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/games/:gameCode", async (req, res) => {
  try {
    const game = await Game.findOne({ gameCode: req.params.gameCode });
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
startServer();
