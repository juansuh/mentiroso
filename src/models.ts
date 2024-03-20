export interface Player {
  name: string;
  remainingDice: number;
}

export interface Bet {
  player: string;
  count: number;
  value: number;
}

export interface RoundEndInfo {
  winner: string;
  playersRevealed: {
    name: string;
    dice: number[];
  }[];
}

export type RoomState = "join" | "lobby" | "game";
