import activityDataJSON from "@/assets/activity-data/A-0000.json";
import handballFieldImage from "@/assets/fields/handball-field.webp";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item, ItemMedia, ItemTitle } from "@/components/ui/item";
import RankingTable from "@/components/ui/RankingTable";
import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/ui/StatCard";
import TopBar from "@/components/ui/TopBar";
import UserAvatar from "@/components/ui/UserAvatar";
import { activityParticipants, getUserById } from "@/data/app-data";
import type { ActivityData } from "@/data/models/activity";
import { calculateRanking } from "@/data/models/activity-ranking";
import type { Position } from "@/data/models/position";
import {
  processExistingRealTimeData,
  processRealTimeEvent,
  processTimePassing,
  type RealTimeEvent,
} from "@/data/models/real-time";
import { ChevronDown, ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const activityRealTimeEvents = (activityDataJSON as RealTimeEvent[]).sort(
  (a, b) => a.timestamp - b.timestamp
);

function secondsToTimeString(seconds: number): string {
  const min = Math.trunc(seconds / 60);
  const s = Math.round(seconds % 60);
  return min > 0 ? `${min}m ${s}s` : `${s}s`;
}

function toFixed2(value: number): number {
  return +value.toFixed(2);
}

function toPercentageFixed2(value: number): number {
  return toFixed2(value * 100);
}

export default function ActivityData() {
  const { activity: activityId } = useParams();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  let realTimeDataIndex = Math.round((3 * activityRealTimeEvents.length) / 4);

  const [activityData, setActivityData] = useState(
    processExistingRealTimeData(
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
        winnerCheck: (playerId: string, data: ActivityData) => {
          return data.playerData[playerId].shots.in >= 7;
        },
      },
      activityRealTimeEvents,
      activityRealTimeEvents[realTimeDataIndex].timestamp
    )
  );

  useEffect(() => {
    const intervalTimeSecs = 0.3;
    const intervalId = setInterval(() => {
      setActivityData((currentData) => {
        const targetTime = currentData.elapsedTime + intervalTimeSecs;
        const events = activityRealTimeEvents.filter(
          (e) => e.timestamp > currentData.elapsedTime && e.timestamp <= targetTime
        );

        let lastTimestamp = currentData.elapsedTime;
        for (let i = 0; i < events.length && !currentData.winner; ++i) {
          const event = events[i];
          const elapsedTime = event.timestamp - lastTimestamp;

          if (elapsedTime > 0) {
            currentData = processTimePassing(elapsedTime, currentData);
          }
          currentData = processRealTimeEvent(event, currentData);

          lastTimestamp = event.timestamp;
        }

        return { ...currentData };
      });
    }, intervalTimeSecs * 1000);

    return () => clearInterval(intervalId);
  }, []);

  console.log(activityData);

  function renderPlayerView(playerId: string) {
    const playerData = activityData.playerData[playerId];

    const shotsInPercentage = toPercentageFixed2(
      playerData.shots.in / (playerData.shots.in + playerData.shots.out)
    );

    return (
      <>
        {/* Campo de juego */}
        <SectionTitle>Posición en el campo</SectionTitle>
        <CourtView blueTeam={[playerData.locations[playerData.locations.length - 1]]} />

        {/* Estadísticas do xogador */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={secondsToTimeString(
              Object.keys(playerData.time.playingPosition).reduce(
                (sum, position) => (sum += playerData.time.playingPosition[position]),
                0
              )
            )}
            label="TIEMPO TOTAL DE TURNO"
          />
          <StatCard
            value={playerData.turns.playingPosition[playerData.currentPlayingPosition]}
            label="TURNOS EN POSICIÓN ACTUAL"
          />
          <StatCard
            value={`${shotsInPercentage}%`}
            label="LANZAMIENTOS EXITOSOS"
            progress={shotsInPercentage}
            progressColor="blue"
          />
          <StatCard value={playerData.shots.out} label="TIROS FUERA" />
          <StatCard value={playerData.shots.in} label="GOLES" />
          <StatCard value={playerData.shots.streak} label="RACHA DE GOLES" />
          {playerData.shots.distances.length > 0 ? (
            <>
              <StatCard
                value={`${toFixed2(playerData.shots.distances.reduce((sum, d) => (sum += d), 0) / playerData.shots.distances.length)}m`}
                label="DISTANCIA MEDIA DE TIRO"
              />
              <StatCard
                value={`${toFixed2(playerData.shots.distances[playerData.shots.distances.length - 1])}m`}
                label="DISTANCIA DE ÚLTIMO TIRO"
              />
            </>
          ) : (
            <>
              <StatCard value="N/D" label="DISTANCIA MEDIA DE TIRO" />
              <StatCard value="N/D" label="DISTANCIA DE ÚLTIMO TIRO" />
            </>
          )}
        </div>
      </>
    );
  }

  function renderGlobalView() {
    const remainingTurnTimePercentage =
      activityData.conditions.maxTurnTime != null
        ? toPercentageFixed2(
            (activityData.conditions.maxTurnTime - activityData.turn.remainingTime!) /
              activityData.conditions.maxTurnTime
          )
        : undefined;

    let lanzamientosTotales = 0;
    let lanzamientosExitosos = 0;

    Object.values(activityData.playerData).forEach((playerData) => {
      lanzamientosExitosos += playerData.shots.in;
      lanzamientosTotales += playerData.shots.in + playerData.shots.out;
    });

    const lanzamientosExitososPorcentaje = toPercentageFixed2(
      lanzamientosExitosos / lanzamientosTotales
    );

    const playerRanking = calculateRanking(
      Object.keys(activityData.playerData).map((playerId) => ({
        userId: playerId,
        points: activityData.playerData[playerId].shots.in,
        payload: activityData.playerData[playerId].currentPlayingPosition,
      }))
    );

    return (
      <>
        {/* Campo de juego */}
        <SectionTitle>Posiciones de los jugadores</SectionTitle>
        <CourtView
          blueTeam={Object.values(activityData.playerData).map(
            (playerData) => playerData.locations[playerData.locations.length - 1]
          )}
        />

        {/* Turno actual */}
        <SectionTitle>Turno actual</SectionTitle>

        <Item variant="outline" className="shadow-sm flex flex-row items-center justify-between">
          <ItemTitle className="w-full">
            <ItemMedia>
              <ClockIcon className="size-4" />
            </ItemMedia>

            {activityData.turn.remainingTime != null && (
              <div className="text-base font-semibold">
                {secondsToTimeString(activityData.turn.remainingTime)} restantes
              </div>
            )}

            <div className="flex gap-2 ml-auto">
              <UserAvatar userId={activityData.turn.player} size={6} />{" "}
              {getUserById(activityData.turn.player).name}
            </div>
          </ItemTitle>
        </Item>

        {/* Cards Datos*/}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={secondsToTimeString(activityData.elapsedTime)}
            label="TIEMPO TRANSCURRIDO"
            progress={remainingTurnTimePercentage}
            progressColor="red"
          />
          <StatCard
            value={`${lanzamientosExitososPorcentaje}%`}
            label="LANZAMIENTOS EXITOSOS"
            progress={lanzamientosExitososPorcentaje}
            progressColor="blue"
          />
        </div>

        {/* Ranking de xogadores */}
        <SectionTitle>Ranking</SectionTitle>

        <RankingTable
          labels={{
            value: "Goles",
            subject: "Jugador",
            extra: "Posición",
          }}
          rankings={playerRanking}
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
              <ChevronDown className="size-4" />
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
              {activityData.conditions.participants.map((userId) => {
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

interface CourtViewProps {
  blueTeam?: Position[];
  redTeam?: Position[];
}

function CourtView(props: CourtViewProps) {
  const fieldSize: Position = { x: 740, y: 443 };
  const playingFieldSize: Position = { x: 634, y: 401 };
  const playingFieldStart: Position = { x: 53, y: 22 };

  return (
    <div className="w-full relative border rounded-lg shadow-sm overflow-hidden">
      <img src={handballFieldImage} alt="Playing field background" className="w-full" />
      <svg viewBox={`0 0 ${fieldSize.x} ${fieldSize.y}`} className="absolute top-0 w-full">
        {props.blueTeam?.map((p, i) => (
          <circle
            key={i}
            cx={(p.x * playingFieldSize.x) / 100 + playingFieldStart.x}
            cy={(p.y * playingFieldSize.y) / 100 + playingFieldStart.y}
            r="12"
            className="fill-blue-500 stroke-2 stroke-white"
          />
        ))}
        {props.redTeam?.map((p, i) => (
          <circle
            key={i}
            cx={(p.x * playingFieldSize.x) / 100 + playingFieldStart.x}
            cy={(p.y * playingFieldSize.y) / 100 + playingFieldStart.y}
            r="12"
            className="fill-red-500 stroke-2 stroke-white"
          />
        ))}
      </svg>
    </div>
  );
}
