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

export type RealTimeEventShot = RealTimeEventBase<
  "shot",
  {
    player: string;
  } & ({ type: "out" } | { type: "in"; goal: boolean; x: number; y: number })
>;

export type RealTimeEvent = RealTimeEventPosition | RealTimeEventPossesion | RealTimeEventShot;

export type RefeereEntryType = "turn" | "game-position" | "shot" | "foul" | "win";

export interface RefeereEntryBase<T extends RefeereEntryType, D> {
  type: T;
  timestamp: number;
  data: D;
}

export type RefeereEntryTurnChange = RefeereEntryBase<
  "turn",
  {
    from?: string;
    to: string;
  }
>;

export type RefeereEntryGamePositionChange = RefeereEntryBase<
  "game-position",
  {
    player: string;
    from?: string;
    to: string;
  }
>;

export type RefeereEntryShot = RefeereEntryBase<
  "shot",
  {
    type: "in" | "goalkeeper" | "out";
    player: string;
    distance: number;
    gamePosition: string;
  }
>;

export type RefeereEntryWin = RefeereEntryBase<
  "win",
  {
    player: string;
  }
>;

export type RefeereEntryFoul = RefeereEntryBase<
  "foul",
  {
    player: string;
  } & ({ type: "timeout" } | { type: "area"; distance: number } | { type: "shot-without-turn" })
>;

export type RefereeEntry =
  | RefeereEntryTurnChange
  | RefeereEntryGamePositionChange
  | RefeereEntryShot
  | RefeereEntryFoul
  | RefeereEntryWin;

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
    referee: [
      // Posiciones de los jugadores
      ...conditions.participants.map(
        (p) =>
          ({
            type: "game-position",
            timestamp: 0,
            data: {
              player: p,
              to: conditions.gamePositions[0],
            },
          }) as RefeereEntryGamePositionChange
      ),
      // Primer jugador con turno
      {
        type: "turn",
        timestamp: 0,
        data: {
          to: conditions.participants[0],
        },
      } as RefeereEntryTurnChange,
    ],
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
            currentPlayingPosition: conditions.gamePositions[0],
            locations: [],
            time: {
              total: 0,
              gamePosition: conditions.gamePositions.reduce(
                (map, position) => ({ ...map, [position]: 0 }),
                {}
              ),
            },
            turns: {
              total: 0,
              gamePosition: conditions.gamePositions.reduce(
                (map, position) => ({
                  ...map,
                  [position]:
                    playerId === conditions.participants[0] &&
                    position === conditions.gamePositions[0]
                      ? 1
                      : 0,
                }),
                {}
              ),
            },
            shots: {
              in: 0,
              goalkeeper: 0,
              out: 0,
              total: 0,
              gamePosition: conditions.gamePositions.reduce(
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
  const lastTurnPlayer = report.data.turn.player;

  report.data.turn = {
    player: getNextParticipant(report),
    inPossesion: false,
    possesionTime: 0,
    remainingTime: report.conditions.maxTurnTime,
  };

  const nextPlayerData = report.data.players[report.data.turn.player];
  nextPlayerData.turns.total += 1;
  nextPlayerData.turns.gamePosition[nextPlayerData.currentPlayingPosition] += 1;

  // Jugador tiene el turno
  report.referee.push({
    type: "turn",
    timestamp: report.data.elapsedTime,
    data: {
      from: lastTurnPlayer,
      to: report.data.turn.player,
    },
  });
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
          const playerData = report.data.players[event.data.player];

          const distancia = distanceBetween(
            playerData.locations[playerData.locations.length - 1],
            report.conditions.locations.goalPost,
            report.conditions.scales.field
          );

          // Registramos distancia de lanzamiento
          playerData.shots.distances.push(distancia);

          // Lanzamiento invalido desde dentro del area
          if (
            report.conditions.minShotDistance != null &&
            distancia < report.conditions.minShotDistance
          ) {
            report.referee.push({
              type: "foul",
              timestamp: event.timestamp,
              data: {
                type: "area",
                player: event.data.player,
                distance: distancia,
              },
            });
          }
          // Lanzamiento válido desde fuera del area
          else {
            // Jugador lanza a portería
            report.referee.push({
              type: "shot",
              timestamp: event.timestamp,
              data: {
                type: event.data.type === "in" ? (event.data.goal ? "in" : "goalkeeper") : "out",
                player: event.data.player,
                distance: distancia,
                gamePosition: playerData.currentPlayingPosition,
              },
            });

            playerData.shots.total += 1;
            playerData.shots.gamePosition[playerData.currentPlayingPosition].total += 1;

            // Pelota dentro de la portería
            if (event.data.type === "in") {
              // Registramos gol
              if (event.data.goal) {
                playerData.shots.in += 1;
                playerData.shots.gamePosition[playerData.currentPlayingPosition].in += 1;
                playerData.shots.streak.current += 1;
                if (playerData.shots.streak.best < playerData.shots.streak.current) {
                  playerData.shots.streak.best = playerData.shots.streak.current;
                }

                const hasWon = report.winning.check(report.data.turn.player, report);

                // Comprobamos si ha ganado o hay que actualizar a la nueva posición
                if (hasWon) {
                  report.winning.player = report.data.turn.player;

                  // Jugador ha ganado
                  report.referee.push({
                    type: "win",
                    timestamp: event.timestamp,
                    data: {
                      player: event.data.player,
                    },
                  });
                } else {
                  const lastGamePosition = playerData.currentPlayingPosition;

                  playerData.currentPlayingPosition =
                    report.conditions.gamePositions[
                      report.conditions.gamePositions.findIndex(
                        (p) => p === playerData.currentPlayingPosition
                      ) + 1
                    ];

                  // Jugador cambia de posición de juego
                  report.referee.push({
                    type: "game-position",
                    timestamp: event.timestamp,
                    data: {
                      player: event.data.player,
                      from: lastGamePosition,
                      to: playerData.currentPlayingPosition,
                    },
                  });
                }
              }
              // Parada del portero
              else {
                playerData.shots.goalkeeper += 1;
                playerData.shots.gamePosition[playerData.currentPlayingPosition].goalkeeper += 1;
                playerData.shots.streak.current = 0;
              }
            } // Registramos fallo
            else {
              playerData.shots.out += 1;
              playerData.shots.gamePosition[playerData.currentPlayingPosition].out += 1;
              playerData.shots.streak.current = 0;
            }

            // Registramos a que posición de la portería fue el lanzamiento
            if (event.data.type === "in") {
              playerData.shots.locations.push({ x: event.data.x, y: event.data.y });
            }
          }

          // Pasamos turno si no se termina
          if (!report.winning.player) {
            updateTurn(report);
          }
        } else {
          // Jugador lanza sin tener el turno
          report.referee.push({
            type: "foul",
            timestamp: event.timestamp,
            data: {
              type: "shot-without-turn",
              player: event.data.player,
            },
          });
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
      playerData.time.total += time;
      playerData.time.gamePosition[playerData.currentPlayingPosition] += time;
    }
  }

  // Tiempo de turno actual
  if (report.data.turn.remainingTime != null) {
    report.data.turn.remainingTime -= time;

    // Si el tiempo de turno llega a 0, pasamos turno
    if (report.data.turn.remainingTime < 0) {
      // Jugador lanza sin tener el turno
      report.referee.push({
        type: "foul",
        timestamp: report.data.elapsedTime,
        data: {
          type: "timeout",
          player: report.data.turn.player,
        },
      });

      updateTurn(report);
    }
  }
}
