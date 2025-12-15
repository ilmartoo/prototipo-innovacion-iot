import handballFieldImage from "@/assets/handball-field.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import StatCard from "@/components/ui/StatCard";
import TopBar from "@/components/ui/TopBar";
import UserAvatar from "@/components/ui/UserAvatar";
import {
  activityData,
  activityPlayerData,
  activityPlayerPositions,
  activityRankings,
} from "@/data/app-data";
import type { ActivityRanking } from "@/data/models/activity-ranking";
import type { Position } from "@/data/models/position";
import { ChevronDown, ClockIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { getUserById } from "../data/app-data";

function secondsToTimeString(seconds: number): string {
  const min = +(seconds / 60).toFixed(0);
  const s = seconds % 60;

  return min > 0 ? `${min}m ${s}s` : `${s}s`;
}

export default function ActivityData() {
  const { activity: activityId } = useParams();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  const selectedPlayerData =
    (selectedPlayerId && activityRankings[activityId!][selectedPlayerId]) || null;

  function renderPlayerView(playerRanking: ActivityRanking<string>) {
    const playerPos = activityPlayerPositions[activityId!][playerRanking.userId];
    const playerData = activityPlayerData[activityId!][playerRanking.userId];

    const lanzamientosExitososPorcentaje = +(
      (playerData.lanzamientos.aciertos /
        (playerData.lanzamientos.aciertos + playerData.lanzamientos.fallos)) *
      100
    ).toFixed(2);

    return (
      <>
        {/* Campo de juego */}
        <CourtView blueTeam={[playerPos]} />

        {/* Estadísticas do xogador */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={secondsToTimeString(playerData.turno.tiempoActual)}
            label="TIEMPO TOTAL DE TURNO"
          />
          <StatCard
            value={playerData.turno.totalEnPosicionActual}
            label="TURNOS EN POSICIÓN ACTUAL"
          />
          <StatCard
            value={`${lanzamientosExitososPorcentaje}%`}
            label="LANZAMIENTOS EXITOSOS"
            progress={lanzamientosExitososPorcentaje}
            progressColor="blue"
          />
          <StatCard value={playerData.lanzamientos.fallos} label="TIROS FUERA" />
          <StatCard value={playerRanking.points} label="GOLES" />
          <StatCard value={playerData.rachaDeAciertos} label="RACHA DE GOLES" />
          <StatCard value={`${playerData.distanciaTiro.media}m`} label="DISTANCIA MEDIA DE TIRO" />
          <StatCard value={`${playerData.distanciaTiro.actual}m`} label="DISTANCIA ACTUAL" />
        </div>
      </>
    );
  }

  function renderGlobalView() {
    const globalData = activityData[activityId!];
    const currentPlayer = getUserById(globalData.turno.jugadorId);

    let lanzamientosTotales = 0;
    let lanzamientosExitosos = 0;

    Object.values(activityPlayerData[activityId!]).forEach((p) => {
      lanzamientosTotales += p.lanzamientos.aciertos + p.lanzamientos.fallos;
      lanzamientosExitosos += p.lanzamientos.aciertos;
    });

    const lanzamientosExitososPorcentaje = +(
      (lanzamientosExitosos / lanzamientosTotales) *
      100
    ).toFixed(2);

    return (
      <>
        {/* Campo de juego */}
        <CourtView blueTeam={Object.values(activityPlayerPositions[activityId!])} />

        {/* Turno actual */}
        <h2 className="text-xl font-semibold">Turno actual</h2>

        <Item variant="outline" className="shadow-sm flex flex-row items-center justify-between">
          <ItemTitle className="w-full">
            <ItemMedia>
              <ClockIcon className="size-4" />
            </ItemMedia>

            <div className="text-base font-semibold">
              {secondsToTimeString(globalData.tiempo)} restantes
            </div>

            <div className="flex gap-2 ml-auto">
              <UserAvatar userId={currentPlayer.id} size={6} /> {currentPlayer.name}
            </div>
          </ItemTitle>
        </Item>

        {/* Cards Datos*/}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={secondsToTimeString(globalData.tiempo)}
            label="TIEMPO TOTAL"
            progress={75}
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
        <h2 className="text-xl font-semibold">Ranking</h2>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between px-4 pb-3 text-sm font-medium text-muted-foreground border-b">
              <div className="w-1/5">Goles</div>
              <div className="flex-1">Jugador</div>
              <div>Posición</div>
            </div>

            {Object.values(activityRankings[activityId!]).map((ranking, index, arr) => (
              <div key={ranking.id}>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="w-1/5 text-lg font-semibold">{ranking.points}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <UserAvatar userId={ranking.userId} size={8} />
                    <span>{getUserById(ranking.userId).name}</span>
                  </div>
                  <div className="text-muted-foreground">{ranking.payload}</div>
                </div>
                {index < arr.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
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
              {Object.keys(activityPlayerData[activityId!]).map((userId) => {
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
      {selectedPlayerData ? renderPlayerView(selectedPlayerData) : renderGlobalView()}
    </>
  );
}

interface CourtViewProps {
  blueTeam?: Position[];
  redTeam?: Position[];
}

function CourtView(props: CourtViewProps) {
  const fieldSize: Position = { x: 740, y: 443 };
  const playingFieldStart: Position = { x: 53, y: 22 };
  // const playingFieldSize: Position = { x: 634, y: 401 };

  return (
    <div className="w-full relative border rounded-lg shadow-sm overflow-hidden">
      <img src={handballFieldImage} alt="Playing field background" className="w-full" />
      <svg viewBox={`0 0 ${fieldSize.x} ${fieldSize.y}`} className="absolute top-0 w-full">
        {props.blueTeam?.map((p, i) => (
          <circle
            key={i}
            cx={p.x + playingFieldStart.x}
            cy={p.y + playingFieldStart.y}
            r="12"
            className="fill-blue-500 stroke-2 stroke-white"
          />
        ))}
        {props.redTeam?.map((p, i) => (
          <circle
            key={i}
            cx={p.x + playingFieldStart.x}
            cy={p.y + playingFieldStart.y}
            r="12"
            className="fill-red-500 stroke-2 stroke-white"
          />
        ))}
      </svg>
    </div>
  );
}
