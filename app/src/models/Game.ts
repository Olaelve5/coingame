export interface Game {
    _id: string;
    gameCode: string;
    players: any[];
    hostId: string;
    round: number;
    status: "waiting" | "playing" | "finished";
    // Include other game properties as needed
  }