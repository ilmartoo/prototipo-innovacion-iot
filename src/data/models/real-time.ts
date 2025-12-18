import type {
  ActivityConditions,
  ActivityPlayerData,
  ActivityReport,
} from "@/data/models/activity";
import type { Position } from "@/data/models/position";

export type RealTimeEventType = "position" | "possesion" | "shot";

export interface RealTimeEventBase<T extends RealTimeEventType, D> {
  type: T;
  timestamp: number;
  data: D;
}

export type RealTimeEventPosition = RealTimeEventBase<
  "position",
  {
    player: string;
    x: number;
    y: number;
  }
>;

export type RealTimeEventPossesion = RealTimeEventBase<
  "possesion",
  {
    player: string;
  }
>;

export type RealTimeEventShotOut = RealTimeEventBase<
  "shot",
  {
    player: string;
    type: "out";
  }
>;

export type RealTimeEventShotIn = RealTimeEventBase<
  "shot",
  {
    player: string;
    type: "in";
    goal: boolean;
    x: number;
    y: number;
  }
>;

export type RealTimeEvent =
  | RealTimeEventPosition
  | RealTimeEventPossesion
  | RealTimeEventShotOut
  | RealTimeEventShotIn;

export function processExistingRealTimeData(
  conditions: ActivityConditions,
  winCheck: (player: string, report: ActivityReport) => boolean,
  events: RealTimeEvent[],
  until?: number
): ActivityReport {
  let data: ActivityReport = {
    conditions,
    winning: {
      check: winCheck,
    },
    data: {
      elapsedTime: 0,
      turn: {
        player: conditions.participants[0],
        inPossesion: false,
        possesionTime: 0,
        remainingTime: conditions.maxTurnTime,
      },
      players: conditions.participants.reduce(
        (map, playerId) => ({
          ...map,
          [playerId]: {
            currentPlayingPosition: conditions.playingPositions[0],
            locations: [],
            time: {
              playingPosition: conditions.playingPositions.reduce(
                (map, position) => ({ ...map, [position]: 0 }),
                {}
              ),
            },
            turns: {
              playingPosition: conditions.playingPositions.reduce(
                (map, position) => ({
                  ...map,
                  [position]:
                    playerId === conditions.participants[0] &&
                    position === conditions.playingPositions[0]
                      ? 1
                      : 0,
                }),
                {}
              ),
            },
            shots: {
              in: 0,
              out: 0,
              streak: 0,
              positions: [],
              distances: [],
            },
          },
        }),
        {} as Record<string, ActivityPlayerData>
      ),
    },
  };

  let lastTimestamp = 0;
  for (
    let i = 0;
    i < events.length && !data.winning.player && (until == null || events[i].timestamp <= until);
    ++i
  ) {
    const event = events[i];
    const elapsedTime = event.timestamp - lastTimestamp;

    if (elapsedTime > 0) {
      processTimePassing(elapsedTime, data);
    }
    processRealTimeEvent(event, data);

    lastTimestamp = event.timestamp;
  }

  return data;
}

function distanceBetween(from: Position, to: Position, scale: Position): number {
  const x = (from.x - to.x) * scale.x;
  const y = (from.y - to.y) * scale.y;
  return Math.sqrt(x * x + y * y);
}

function getNextParticipant(report: ActivityReport): string {
  const participantIndex = report.conditions.participants.findIndex(
    (p) => p === report.data.turn.player
  );
  return report.conditions.participants[
    (participantIndex + 1) % report.conditions.participants.length
  ];
}

function updateTurn(report: ActivityReport): void {
  report.data.turn = {
    player: getNextParticipant(report),
    inPossesion: false,
    possesionTime: 0,
    remainingTime: report.conditions.maxTurnTime,
  };

  const nextPlayerData = report.data.players[report.data.turn.player];
  nextPlayerData.turns.playingPosition[nextPlayerData.currentPlayingPosition] += 1;
}

export function processRealTimeEvent(event: RealTimeEvent, report: ActivityReport) {
  switch (event.type) {
    case "position":
      {
        report.data.players[event.data.player].locations.push({ x: event.data.x, y: event.data.y });
      }
      break;

    case "possesion":
      {
        // Es el turno del jugador
        if (event.data.player === report.data.turn.player) {
          report.data.turn.inPossesion = true;
        }
      }
      break;

    case "shot":
      {
        // Es el turno del jugador y tiene al menos una posición registrada
        if (
          event.data.player === report.data.turn.player &&
          report.data.players[report.data.turn.player].locations.length > 0
        ) {
          const playerData = report.data.players[report.data.turn.player];

          // Registramos gol
          if (event.data.type === "in" && event.data.goal) {
            playerData.shots.in += 1;
            playerData.shots.streak += 1;

            const hasWon = report.winning.check(report.data.turn.player, report);

            // Comprobamos si ha ganado o hay que actualizar a la nueva posición
            if (hasWon) {
              report.winning.player = report.data.turn.player;
            } else {
              playerData.currentPlayingPosition =
                report.conditions.playingPositions[
                  report.conditions.playingPositions.findIndex(
                    (p) => p === playerData.currentPlayingPosition
                  ) + 1
                ];
            }
          }
          // Registramos fallo
          else {
            playerData.shots.out += 1;
            playerData.shots.streak = 0;
          }

          // Registramos a que posición de la portería fue el lanzamiento
          if (event.data.type === "in") {
            playerData.shots.positions.push({ x: event.data.x, y: event.data.y });
          }

          // Registramos distancia de lanzamiento
          playerData.shots.distances.push(
            distanceBetween(
              playerData.locations[playerData.locations.length - 1],
              report.conditions.locations.goalPost,
              report.conditions.scales.field
            )
          );

          // Pasamos turno si no se termina
          if (!report.winning.player) {
            updateTurn(report);
          }
        }
      }
      break;
  }
}

export function processTimePassing(time: number, report: ActivityReport) {
  // Tiempo transcurrido
  report.data.elapsedTime += time;

  // Tiempo de posesion
  if (report.data.turn.inPossesion) {
    report.data.turn.possesionTime += time;
  }

  // Tiempos de jugador
  for (const player in report.data.players) {
    const playerData = report.data.players[player];

    if (report.data.turn.player === player) {
      playerData.time.playingPosition[playerData.currentPlayingPosition] += time;
    }
  }

  // Tiempo de turno actual
  if (report.data.turn.remainingTime != null) {
    report.data.turn.remainingTime -= time;

    // Si el tiempo de turno llega a 0, pasamos turno
    if (report.data.turn.remainingTime < 0) {
      updateTurn(report);
    }
  }
}
