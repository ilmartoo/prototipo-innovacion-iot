import activityReportJSON from "@/assets/activity-data/A-0000.json";
import handballFieldImage from "@/assets/fields/handball-field.webp";
import handballGoalPostImage from "@/assets/fields/handball-goal-post.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RankingTable from "@/components/ui/RankingTable";
import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/ui/StatCard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import TopBar from "@/components/ui/TopBar";
import UserAvatar from "@/components/ui/UserAvatar";
import {
  activityParticipants,
  getUserById,
  secondsToTimeString,
  toFixed2,
  toPercentageFixed2,
  users,
} from "@/data/app-data";
import { aggregatePayerData, type ActivityReport } from "@/data/models/activity";
import { calculateRanking } from "@/data/models/activity-ranking";
import type { Position } from "@/data/models/position";
import { processExistingRealTimeData, type RealTimeEvent } from "@/data/models/real-time";
import type { User } from "@/data/models/user";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useParams } from "react-router";

const activityRealTimeEvents = (activityReportJSON as RealTimeEvent[]).sort(
  (a, b) => a.timestamp - b.timestamp
);

interface CollapsibleItemProps {
  title: ReactNode;
  value: ReactNode;
}

function TableItem(props: CollapsibleItemProps) {
  return (
    <TableRow>
      <TableCell className="font-semibold">{props.title}</TableCell>
      <TableCell className="text-right">{props.value}</TableCell>
    </TableRow>
  );
}

export default function ActivityReviewData() {
  const { activity: activityId } = useParams();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  const activityReport = processExistingRealTimeData(
    {
      participants: activityParticipants[activityId!],
      playingPositions: [
        "Extremo I",
        "Lateral I",
        "Central",
        "Lateral D",
        "Extremo D",
        "Pivote",
        "Penalti",
      ],
      maxTurnTime: 30,
      scales: {
        field: { x: 40 / 100, y: 20 / 100 },
        goalPost: { x: 3 / 100, y: 2 / 100 },
      },
      locations: {
        goalPost: { x: 100, y: 50 },
      },
    },
    (playerId: string, report: ActivityReport) => {
      return report.data.players[playerId].shots.in >= 7;
    },
    activityRealTimeEvents
  );

  const [isLanzamientosOpen, setIsLanzamientosOpen] = useState(true);
  const [isPositionCollapsibleOpen, setIsPositionCollapsibleOpen] = useState(
    activityReport.conditions.playingPositions.reduce(
      (map, p) => ({ ...map, [p]: false }),
      {} as Record<string, boolean>
    )
  );

  const activityUsers = users.reduce(
    (map, user) => ({ ...map, [user.id]: user }),
    {} as Record<string, User>
  );

  const winnerUser = activityReport.winning.player && activityUsers[activityReport.winning.player];

  // Tiros de jugadores
  const playerShots = Object.keys(activityReport.data.players).map((player) => {
    const shots = activityReport.data.players[player].shots;
    return {
      player,
      acuracyPercentage: toPercentageFixed2(shots.in / (shots.in + shots.out)),
      meanDistance: toFixed2(
        shots.distances.reduce((sum, d) => sum + d, 0) / shots.distances.length
      ),
      maxDistance: toFixed2(Math.max(...shots.distances)),
      minDistance: toFixed2(Math.min(...shots.distances)),
    };
  });

  // Tiempos de turno
  const playerTurnTimes = Object.keys(activityReport.data.players).map((player) => {
    const times = Object.values(activityReport.data.players[player].time.playingPosition).flat();
    const totalTurnTime = times.reduce((sum, t) => sum + t, 0);
    return {
      player,
      totalTurnTime: toFixed2(totalTurnTime),
      meanTurnTime: toFixed2(totalTurnTime / times.length),
    };
  });

  // Jugador más rápido
  let quickestPlayer = playerTurnTimes[0];
  for (let i = 1; i < playerTurnTimes.length; ++i) {
    if (quickestPlayer.meanTurnTime > playerTurnTimes[i].meanTurnTime) {
      quickestPlayer = playerTurnTimes[i];
    }
  }

  // Jugador más preciso
  let bestPrecissionPlayer = playerShots[0];
  for (let i = 1; i < playerShots.length; ++i) {
    if (bestPrecissionPlayer.acuracyPercentage < playerShots[i].acuracyPercentage) {
      bestPrecissionPlayer = playerShots[i];
    }
  }

  // Jugador que más tiempo usó
  let slowestPlayer = playerTurnTimes[0];
  for (let i = 1; i < playerTurnTimes.length; ++i) {
    if (slowestPlayer.meanTurnTime < playerTurnTimes[i].meanTurnTime) {
      slowestPlayer = playerTurnTimes[i];
    }
  }

  // Jugador menos preciso
  let worstPrecissionPlayer = playerShots[0];
  for (let i = 1; i < playerShots.length; ++i) {
    if (worstPrecissionPlayer.acuracyPercentage > playerShots[i].acuracyPercentage) {
      worstPrecissionPlayer = playerShots[i];
    }
  }

  function renderPlayerView(playerId: string) {
    const playerData = activityReport.data.players[playerId];

    return (
      <>
        <SectionTitle
          title="Posicionamiento en el campo"
          subtitle="Movimiento por el campo del jugador a lo largo de la actividad"
        />
        <CourtHeatmapView locations={playerData.locations} />

        <SectionTitle
          title="Localización de lanzamientos"
          subtitle={`De un total de ${playerData.shots.locations.length} lanzamientos del jugador.`}
        />
        <GoalHeatmapView locations={playerData.shots.locations} />

        <SectionTitle title="Estadísticas" />
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={secondsToTimeString(playerData.time.total / playerData.turns.total)}
            label="TIEMPO MEDIO POR LANZAMIENTO"
          />
          <StatCard
            value={secondsToTimeString(playerData.time.total)}
            label="TIEMPO TOTAL UTILIZADO"
            progress={toPercentageFixed2(playerData.time.total / activityReport.data.elapsedTime)}
            progressColor="blue"
          />
          <StatCard value={playerData.shots.in} label="GOLES ANOTADOS" />
          <StatCard value={playerData.shots.streak.best} label="MEJOR RACHA DE GOLES" />
          <StatCard
            value={playerData.shots.in}
            label="LANZAMIENTOS EXITOSOS"
            progress={toPercentageFixed2(playerData.shots.in / playerData.shots.total)}
            progressColor="blue"
          />
          <StatCard
            value={playerData.shots.goalkeeper}
            label="LANZAMIENTOS AL PORTERO"
            progress={toPercentageFixed2(playerData.shots.goalkeeper / playerData.shots.total)}
            progressColor="red"
          />
          <StatCard
            value={playerData.shots.out}
            label="LANZAMIENTOS POR FUERA"
            progress={toPercentageFixed2(playerData.shots.out / playerData.shots.total)}
            progressColor="red"
          />
          <StatCard
            value={`${toFixed2(playerData.shots.distances.reduce((sum, d) => sum + d, 0) / playerData.shots.total)}m`}
            label="DISTANCIA MEDIA DE TIRO"
          />
          <StatCard
            value={`${toFixed2(Math.max(...playerData.shots.distances))}m`}
            label="DISTANCIA MÁXIMA DE TIRO"
          />
          <StatCard
            value={`${toFixed2(Math.min(...playerData.shots.distances))}m`}
            label="DISTANCIA MÍNIMA DE TIRO"
          />
        </div>

        {/* Análisis de lanzamientos */}
        <SectionTitle title="Análisis de lanzamientos" />
        {/* Collapsible principal */}
        <Card>
          <CardContent className="px-2">
            <Collapsible open={isLanzamientosOpen} onOpenChange={setIsLanzamientosOpen}>
              <CollapsibleTrigger className="flex flex-row justify-between items-center w-full px-4">
                <div className="text-left">
                  <h3 className="font-semibold">Lanzamientos</h3>
                  <p className="text-sm text-muted-foreground">
                    Analisis desde las distintas posiciones
                  </p>
                </div>
                <Button variant="ghost" size="icon-sm" asChild>
                  {isLanzamientosOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2 space-y-2">
                {Object.entries(isPositionCollapsibleOpen).map(([position, isOpen]) => (
                  <Collapsible
                    key={position}
                    open={isOpen}
                    onOpenChange={() =>
                      setIsPositionCollapsibleOpen({
                        ...isPositionCollapsibleOpen,
                        [position]: !isOpen,
                      })
                    }
                  >
                    <Card className="border-none shadow-none bg-muted py-2">
                      <CardContent className="px-4">
                        <CollapsibleTrigger className="flex flex-row justify-between items-center w-full">
                          <div className="text-left">
                            <h3 className="font-semibold">{position}</h3>
                            <p className="text-sm text-muted-foreground">
                              {playerData.turns.playingPosition[position]} turno(s)
                            </p>
                          </div>{" "}
                          <Button variant="ghost" size="icon-sm" asChild>
                            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                          </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-2">
                          <Table>
                            <TableHeader>
                              <TableRow></TableRow>
                            </TableHeader>
                            <TableBody>
                              {/* Lanzamientos */}
                              <TableItem
                                title="Lanzamientos acertados"
                                value={`${playerData.shots.playingPosition[position].in} ~ ${playerData.shots.playingPosition[position].total ? toPercentageFixed2(playerData.shots.playingPosition[position].in / playerData.shots.playingPosition[position].total) : 0}%`}
                              />
                              <TableItem
                                title="Lanzamientos al portero"
                                value={`${playerData.shots.playingPosition[position].goalkeeper} ~ ${playerData.shots.playingPosition[position].total ? toPercentageFixed2(playerData.shots.playingPosition[position].goalkeeper / playerData.shots.playingPosition[position].total) : 0}%`}
                              />
                              <TableItem
                                title="Lanzamientos por fuera"
                                value={`${playerData.shots.playingPosition[position].out} ~ ${playerData.shots.playingPosition[position].total ? toPercentageFixed2(playerData.shots.playingPosition[position].out / playerData.shots.playingPosition[position].total) : 0}%`}
                              />
                              {/* Tiempos */}
                              <TableItem
                                title="Tiempo en la posición"
                                value={secondsToTimeString(
                                  playerData.time.playingPosition[position]
                                )}
                              />
                              <TableItem
                                title="Tiempo medio por lanzamiento"
                                value={
                                  playerData.shots.playingPosition[position].total
                                    ? secondsToTimeString(
                                        playerData.time.playingPosition[position] /
                                          playerData.shots.playingPosition[position].total
                                      )
                                    : "0s"
                                }
                              />
                            </TableBody>
                          </Table>
                        </CollapsibleContent>
                      </CardContent>
                    </Card>
                  </Collapsible>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </>
    );
  }

  function renderGlobalView() {
    const playerAgg = aggregatePayerData(activityReport);

    const ranking = calculateRanking(
      Object.keys(activityReport.data.players).map((playerId) => ({
        userId: playerId,
        points: activityReport.data.players[playerId].shots.in,
        payload: activityReport.data.players[playerId].currentPlayingPosition,
      }))
    );

    return (
      <>
        {winnerUser && (
          <>
            <SectionTitle
              title={
                <>
                  <UserAvatar
                    className="inline-block align-bottom"
                    userId={winnerUser.id}
                    size={6}
                  />{" "}
                  {winnerUser.name} {winnerUser.surname} ha ganado
                </>
              }
              subtitle={`Ha anotado un total de ${activityReport.data.players[winnerUser.id].shots.in} goles.`}
            />
          </>
        )}

        <SectionTitle
          title="Posicionamiento en el campo"
          subtitle="Movimiento por el campo de los jugadores a lo largo de la actividad."
        />
        <CourtHeatmapView locations={playerAgg.locations} />

        <SectionTitle
          title="Localización de lanzamientos"
          subtitle={`De un total de ${playerAgg.shots.locations.length} lanzamientos a portería por parte de los jugadores.`}
        />
        <GoalHeatmapView locations={playerAgg.shots.locations} />

        <SectionTitle title="Estadísticas globales" />
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={secondsToTimeString(playerAgg.time.total / playerAgg.turns.total)}
            label="TIEMPO MEDIO POR LANZAMIENTO"
          />
          <StatCard
            value={secondsToTimeString(playerAgg.time.total)}
            label="TIEMPO TOTAL UTILIZADO"
            progress={toPercentageFixed2(playerAgg.time.total / activityReport.data.elapsedTime)}
            progressColor="blue"
          />
          <StatCard value={playerAgg.shots.in} label="GOLES ANOTADOS" />
          <StatCard
            value={playerAgg.shots.in}
            label="LANZAMIENTOS EXITOSOS"
            progress={
              playerAgg.shots.total &&
              toPercentageFixed2(playerAgg.shots.in / playerAgg.shots.total)
            }
            progressColor="blue"
          />
          <StatCard
            value={playerAgg.shots.goalkeeper}
            label="LANZAMIENTOS AL PORTERO"
            progress={
              playerAgg.shots.total &&
              toPercentageFixed2(playerAgg.shots.goalkeeper / playerAgg.shots.total)
            }
            progressColor="red"
          />
          <StatCard
            value={playerAgg.shots.out}
            label="LANZAMIENTOS POR FUERA"
            progress={
              playerAgg.shots.total &&
              toPercentageFixed2(playerAgg.shots.out / playerAgg.shots.total)
            }
            progressColor="red"
          />
          {playerAgg.shots.distances.length > 0 && (
            <>
              <StatCard
                value={`${toFixed2(playerAgg.shots.distances.reduce((sum, d) => sum + d, 0) / playerAgg.shots.total)}m`}
                label="DISTANCIA MEDIA DE TIRO"
              />
              <StatCard
                value={`${toFixed2(Math.max(...playerAgg.shots.distances))}m`}
                label="DISTANCIA MÁXIMA DE TIRO"
              />
              <StatCard
                value={`${toFixed2(Math.min(...playerAgg.shots.distances))}m`}
                label="DISTANCIA MÍNIMA DE TIRO"
              />
            </>
          )}
        </div>

        <SectionTitle title="Estadísticas individuales" />
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={`${secondsToTimeString(quickestPlayer.meanTurnTime)}/tiro`}
            label="LANZADOR MÁS RÁPIDO"
            subtitle={`${activityUsers[quickestPlayer.player].name} ${activityUsers[quickestPlayer.player].surname}`}
            className="text-center"
          />
          <StatCard
            value={`${bestPrecissionPlayer.acuracyPercentage}% acierto`}
            label="JUGADOR MÁS PRECISO"
            subtitle={`${activityUsers[bestPrecissionPlayer.player].name} ${activityUsers[bestPrecissionPlayer.player].surname}`}
            className="text-center"
          />
          <StatCard
            value={`${secondsToTimeString(slowestPlayer.meanTurnTime)}/tiro`}
            label="LANZADOR MÁS LENTO"
            subtitle={`${activityUsers[slowestPlayer.player].name} ${activityUsers[slowestPlayer.player].surname}`}
            className="text-center"
          />
          <StatCard
            value={`${worstPrecissionPlayer.acuracyPercentage}% acierto`}
            label="JUGADOR MENOS PRECISO"
            subtitle={`${activityUsers[worstPrecissionPlayer.player].name} ${activityUsers[worstPrecissionPlayer.player].surname}`}
            className="text-center"
          />
        </div>

        <SectionTitle title="Ranking de jugadores" />
        <RankingTable
          labels={{
            value: "Goles",
            subject: "Jugador",
            extra: "Posición",
          }}
          rankings={ranking}
        />
      </>
    );
  }

  return (
    <>
      <TopBar title="Datos de actividad" to="/">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-32 justify-between text-sm">
              {selectedPlayerId ? getUserById(selectedPlayerId).name : "Global"}
              <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSelectedPlayerId("")}>Global</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-sm italic font-medium text-muted-foreground">
                Jugadores
              </DropdownMenuLabel>
              {activityReport.conditions.participants.map((userId) => {
                const user = getUserById(userId);
                return (
                  <DropdownMenuItem key={userId} onClick={() => setSelectedPlayerId(userId)}>
                    {user.name} {user.surname}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TopBar>

      {/* Renderizado condicional */}
      {selectedPlayerId ? renderPlayerView(selectedPlayerId) : renderGlobalView()}
    </>
  );
}

function createHeatmap(
  locations: Position[],
  cuadrants: Position
): { heat: number[][]; maximum: number } {
  // Crear cuadrantes
  const presences: number[][] = [];
  for (let ri = 0; ri < cuadrants.x; ++ri) {
    const arr = [];
    for (let ci = 0; ci < cuadrants.y; ++ci) {
      arr[ci] = 0;
    }
    presences.push(arr);
  }

  // Repartir posiciones en los cuadrantes
  let maxPresence = 0;
  for (const pos of locations) {
    const cuadrant: Position = {
      x: Math.round((pos.x / 100) * cuadrants.x),
      y: Math.round((pos.y / 100) * cuadrants.y),
    };
    const presence = (presences[cuadrant.x][cuadrant.y] += 1);
    if (presence > maxPresence) {
      maxPresence = presence;
    }
  }

  // Obtener porcentaje de tiempo en ese cuadrante
  return {
    heat: presences.map((row) => row.map((p) => toFixed2((p / maxPresence) * 100))),
    maximum: maxPresence,
  };
}

const heatmapGradientStops =
  "var(--color-red-600) 0%, var(--color-yellow-400) 40%, var(--color-green-500) 70%, var(--color-blue-600) 85%, transparent 100%";

interface HeatmapViewProps {
  locations: Position[];
}

function CourtHeatmapView(props: HeatmapViewProps) {
  const imageFieldSize: Position = { x: 740, y: 443 };
  // const imagePlayingFieldSize: Position = { x: 634, y: 401 };
  const imagePlayingFieldStart: Position = { x: 53, y: 22 };

  const heatmapCuadrants: Position = { x: 7, y: 10 };

  const { heat, maximum } = createHeatmap(props.locations, heatmapCuadrants);
  handballGoalPostImage;
  return (
    <Card className="p-2 gap-2">
      <CardContent className="p-0">
        <div className="w-full relative border rounded-sm overflow-hidden">
          <img
            src={handballFieldImage}
            alt="Playing field background"
            className="w-full grayscale"
          />
          <div
            className="absolute top-0 size-full grid"
            style={{
              paddingInline: `${toFixed2((imagePlayingFieldStart.x / imageFieldSize.x) * 100)}%`,
              paddingBlock: `${toFixed2((imagePlayingFieldStart.y / imageFieldSize.y) * 50)}%`,
              gridTemplateColumns: `repeat(${heatmapCuadrants.y}, 1fr)`,
              gridTemplateRows: `repeat(${heatmapCuadrants.x}, 1fr)`,
            }}
          >
            {heat.map((row, ri) =>
              row.map((p, ci) => (
                <div
                  key={`${ri}.${ci}`}
                  style={{
                    backgroundPositionY: `${p}%`,
                    backgroundImage: `linear-gradient(0, ${heatmapGradientStops})`,
                  }}
                  className="bg-size-[100%_10002%] opacity-75"
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 px-0">
        <span className="w-1/6 font-semibold text-sm text-right">0%</span>
        <hr
          className="flex-1 h-3 rounded-md"
          style={{
            backgroundImage: `linear-gradient(-90deg, ${heatmapGradientStops})`,
          }}
        />
        <span className="w-1/6 font-semibold text-sm text-left">
          {toPercentageFixed2(maximum / props.locations.length)}%
        </span>
      </CardFooter>
    </Card>
  );
}

function GoalHeatmapView(props: HeatmapViewProps) {
  const heatmapCuadrants: Position = { x: 8, y: 8 };

  const { heat, maximum } = createHeatmap(props.locations, heatmapCuadrants);
  return (
    <Card className="p-2 gap-2">
      <CardContent className="p-0">
        <div className="w-full relative border rounded-lg shadow-sm overflow-hidden">
          <img
            src={handballGoalPostImage}
            alt="Playing field background"
            className="w-full grayscale"
          />
          <div
            className="absolute top-0 size-full grid"
            style={{
              gridTemplateColumns: `repeat(${heatmapCuadrants.y},1fr)`,
              gridTemplateRows: `repeat(${heatmapCuadrants.x},1fr)`,
            }}
          >
            {heat.map((row, ri) =>
              row.map((p, ci) => (
                <div
                  key={`${ri}.${ci}`}
                  style={{
                    backgroundPositionY: `${p}%`,
                    backgroundImage: `linear-gradient(0, var(--color-red-600) 0%, var(--color-yellow-400) 40%, var(--color-green-500) 70%, var(--color-blue-600) 85%, transparent 100%)`,
                  }}
                  className="bg-size-[100%_10002%] opacity-85"
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 px-0">
        <span className="w-1/6 font-semibold text-sm text-right">0%</span>
        <hr
          className="flex-1 h-3 rounded-md"
          style={{
            backgroundImage: `linear-gradient(-90deg, ${heatmapGradientStops})`,
          }}
        />
        <span className="w-1/6 font-semibold text-sm text-left">
          {toPercentageFixed2(maximum / props.locations.length)}%
        </span>
      </CardFooter>
    </Card>
  );
}
