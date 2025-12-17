import type { Position } from "@/data/models/position";

export interface Activity {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  date: Date;
  maxParticipants: number;
  started: boolean;
  finished: boolean;
}

export interface ActivityConditions {
  participants: string[];
  playingPositions: string[];
  maxTurnTime?: number;
  scales: {
    field: Position;
    goalPost: Position;
  };
  locations: {
    goalPost: Position;
  };
  winnerCheck: (playerId: string, data: ActivityData) => boolean;
}

export function getActivityTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export interface ActivityData {
  conditions: ActivityConditions;
  winner?: string;
  elapsedTime: number;
  turn: {
    player: string;
    inPossesion: boolean;
    possesionTime: number;
    remainingTime?: number;
  };
  playerData: Record<string, ActivityPlayerData>;
}

export interface ActivityPlayerData {
  currentPlayingPosition: string;
  locations: Position[];
  time: {
    playingPosition: Record<string, number>;
  };
  turns: {
    playingPosition: Record<string, number>;
  };
  shots: {
    in: number;
    out: number;
    streak: number;
    positions: Position[];
    distances: number[];
  };
}
