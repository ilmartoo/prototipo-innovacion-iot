import type { Position } from "@/data/models/position";
import type { RefereeEntry } from "./real-time";

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
  gamePositions: string[];
  maxTurnTime?: number;
  minShotDistance?: number;
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
  referee: RefereeEntry[];
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
    gamePosition: Record<string, number>;
  };
  turns: {
    total: number;
    gamePosition: Record<string, number>;
  };
  shots: {
    in: number;
    goalkeeper: number;
    out: number;
    total: number;
    gamePosition: Record<string, { in: number; goalkeeper: number; out: number; total: number }>;
    streak: { current: number; best: number };
    locations: Position[];
    distances: number[];
  };
}

export function aggregatePayerData(report: ActivityReport): ActivityPlayerData {
  const playerAgg: ActivityPlayerData = {
    currentPlayingPosition: "",
    locations: [],
    time: {
      total: 0,
      gamePosition: report.conditions.gamePositions.reduce(
        (map, position) => ({ ...map, [position]: 0 }),
        {}
      ),
    },
    turns: {
      total: 0,
      gamePosition: report.conditions.gamePositions.reduce(
        (map, position) => ({
          ...map,
          [position]: 0,
        }),
        {}
      ),
    },
    shots: {
      in: 0,
      goalkeeper: 0,
      out: 0,
      total: 0,
      gamePosition: report.conditions.gamePositions.reduce(
        (map, position) => ({
          ...map,
          [position]: {
            in: 0,
            goalkeeper: 0,
            out: 0,
            total: 0,
          },
        }),
        {}
      ),
      streak: { current: 0, best: 0 },
      locations: [],
      distances: [],
    },
  };

  Object.values(report.data.players).forEach((playerData) => {
    playerAgg.locations.push(...playerData.locations);
    playerAgg.shots.locations.push(...playerData.shots.locations);
    playerAgg.shots.distances.push(...playerData.shots.distances);

    playerAgg.time.total += playerData.time.total;

    playerAgg.turns.total += playerData.turns.total;

    playerAgg.shots.in += playerData.shots.in;
    playerAgg.shots.goalkeeper += playerData.shots.goalkeeper;
    playerAgg.shots.out += playerData.shots.out;
    playerAgg.shots.total += playerData.shots.total;

    if (playerAgg.shots.streak.best < playerData.shots.streak.best) {
      playerAgg.shots.streak.best = playerData.shots.streak.best;
    }

    for (const playingPosition of report.conditions.gamePositions) {
      playerAgg.time.gamePosition[playingPosition] += playerData.time.gamePosition[playingPosition];

      playerAgg.turns.gamePosition[playingPosition] +=
        playerData.turns.gamePosition[playingPosition];

      playerAgg.shots.gamePosition[playingPosition].in +=
        playerData.shots.gamePosition[playingPosition].in;
      playerAgg.shots.gamePosition[playingPosition].goalkeeper +=
        playerData.shots.gamePosition[playingPosition].goalkeeper;
      playerAgg.shots.gamePosition[playingPosition].out +=
        playerData.shots.gamePosition[playingPosition].out;
      playerAgg.shots.gamePosition[playingPosition].total +=
        playerData.shots.gamePosition[playingPosition].total;
    }
  });

  return playerAgg;
}
