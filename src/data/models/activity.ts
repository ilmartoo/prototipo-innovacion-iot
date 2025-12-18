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
}

export function getActivityTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export interface ActivityReport {
  conditions: ActivityConditions;
  winning: {
    player?: string;
    check: (player: string, report: ActivityReport) => boolean;
  };
  data: {
    elapsedTime: number;
    turn: {
      player: string;
      inPossesion: boolean;
      possesionTime: number;
      remainingTime?: number;
    };
    players: Record<string, ActivityPlayerData>;
  };
}

export interface ActivityPlayerData {
  currentPlayingPosition: string;
  locations: Position[];
  time: {
    total: number;
    playingPosition: Record<string, number>;
  };
  turns: {
    total: number;
    playingPosition: Record<string, number>;
  };
  shots: {
    in: number;
    goalkeeper: number;
    out: number;
    total: number;
    playingPosition: Record<string, { in: number; goalkeeper: number; out: number }>;
    streak: { current: number; best: number };
    locations: Position[];
    distances: number[];
  };
}
