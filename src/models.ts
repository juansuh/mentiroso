export interface Player {
  name: string;
  remainingDice: number;
}

export type RoomState = "join" | "lobby" | "game";
