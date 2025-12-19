"use client";

import PlayerShuffle from "@/components/host/game/PlayerShuffle";
import { Player } from "@/models/Game";
import { useState } from "react";

const mockPlayers: Player[] = [
  { id: "1", name: "Alice", color: "red", icon: "dragon", roundHistory: [], playedInRound: false, eliminated: false, coins: 10, endRank: 0, connected: true, socketId: "1", awards: [] },
  { id: "2", name: "Bob", color: "blue", icon: "robot", roundHistory: [], playedInRound: false, eliminated: false, coins: 10, endRank: 0, connected: true, socketId: "2", awards: [] },
  { id: "3", name: "Charlie", color: "green", icon: "pizza", roundHistory: [], playedInRound: false, eliminated: false, coins: 10, endRank: 0, connected: true, socketId: "3", awards: [] },
  { id: "4", name: "David", color: "yellow", icon: "rocket", roundHistory: [], playedInRound: false, eliminated: false, coins: 10, endRank: 0, connected: true, socketId: "4", awards: [] },
];

export default function TestShufflePage() {
  const [shuffling, setShuffling] = useState(false);
  const [finished, setFinished] = useState(false);

  return (
    <div style={{ padding: 20, background: '#333', minHeight: '100vh', color: 'white' }}>
      <h1>Player Shuffle Test</h1>
      <button 
        id="start-shuffle"
        onClick={() => {
          setShuffling(false);
          setFinished(false);
          setTimeout(() => setShuffling(true), 100);
        }}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Start Shuffle (3s)
      </button>
      
      <div style={{ marginTop: 50, transform: 'scale(2)' }}>
        {shuffling && (
            <PlayerShuffle
                players={mockPlayers}
                targetPlayerId="3" // Charlie
                duration={3}
                onComplete={() => setFinished(true)}
            />
        )}
      </div>

      {finished && <div id="shuffle-finished" style={{ marginTop: 20, color: 'lime' }}>Finished! Target: Charlie</div>}
    </div>
  );
}
