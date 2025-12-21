import handballFieldImage from "@/assets/fields/handball-field.webp";
import { Card, CardContent } from "@/components/ui/card";
import RankingTable from "@/components/ui/RankingTable";
import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/ui/StatCard";
import { secondsToTimeString, toFixed2, toPercentageFixed2 } from "@/data/app-data";
import type { ActivityReport } from "@/data/models/activity";
import { calculateRanking } from "@/data/models/activity-ranking";
import type { Position } from "@/data/models/position";
import type { User } from "@/data/models/user";

interface ActivityLiveDataProps {
  report: ActivityReport;
  player?: User;
}

export default function ActivityLiveTab(props: ActivityLiveDataProps) {
  function renderPlayerView(player: User) {
    const playerData = props.report.data.players[player.id];

    const shotsInPercentage = playerData.shots.total
      ? toPercentageFixed2(playerData.shots.in / playerData.shots.total)
      : 0;

    return (
      <>
        {/* Campo de juego */}
        <SectionTitle
          title="Posicionamiento del jugador"
          subtitle={`Posición en el campo de ${player.name} ${player.surname}.`}
        />
        <CourtView blueTeam={[playerData.locations[playerData.locations.length - 1]]} />

        {/* Estadísticas do xogador */}
        <SectionTitle title="Estadísticas" />
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={secondsToTimeString(
              Object.keys(playerData.time.gamePosition).reduce(
                (sum, position) => (sum += playerData.time.gamePosition[position]),
                0
              )
            )}
            label="TIEMPO TOTAL DE TURNO"
          />
          <StatCard
            value={playerData.turns.gamePosition[playerData.currentPlayingPosition]}
            label="TURNOS EN POSICIÓN ACTUAL"
          />
          <StatCard
            value={`${shotsInPercentage}%`}
            label="LANZAMIENTOS EXITOSOS"
            progress={shotsInPercentage}
            progressColor="blue"
          />
          <StatCard value={playerData.shots.goalkeeper} label="LANZAMIENTOS AL PORTERO" />
          <StatCard value={playerData.shots.out} label="LANZAMIENTOS POR FUERA" />
          <StatCard value={playerData.shots.in} label="GOLES ANOTADOS" />
          <StatCard value={playerData.shots.streak.current} label="RACHA DE GOLES ACTUAL" />
          <StatCard value={playerData.shots.streak.best} label="MEJOR RACHA DE GOLES" />
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
      props.report.conditions.maxTurnTime != null
        ? toPercentageFixed2(
            (props.report.conditions.maxTurnTime - props.report.data.turn.remainingTime!) /
              props.report.conditions.maxTurnTime
          )
        : undefined;

    let lanzamientosTotales = 0;
    let lanzamientosExitosos = 0;
    let lanzamientosAlPortero = 0;
    let lanzamientosFuera = 0;

    Object.values(props.report.data.players).forEach((playerData) => {
      lanzamientosExitosos += playerData.shots.in;
      lanzamientosAlPortero += playerData.shots.goalkeeper;
      lanzamientosFuera += playerData.shots.out;
      lanzamientosTotales += playerData.shots.total;
    });

    const lanzamientosExitososPorcentaje = lanzamientosTotales
      ? toPercentageFixed2(lanzamientosExitosos / lanzamientosTotales)
      : 0;
    const lanzamientosAlPorteroPorcentaje = lanzamientosTotales
      ? toPercentageFixed2(lanzamientosAlPortero / lanzamientosTotales)
      : 0;
    const lanzamientosFueraPorcentaje = lanzamientosTotales
      ? toPercentageFixed2(lanzamientosFuera / lanzamientosTotales)
      : 0;

    const playerRanking = calculateRanking(
      Object.keys(props.report.data.players).map((playerId) => ({
        userId: playerId,
        points: props.report.data.players[playerId].shots.in,
        payload: props.report.data.players[playerId].currentPlayingPosition,
      }))
    );

    return (
      <>
        {/* Campo de juego */}
        <SectionTitle
          title="Posicionamiento de los jugadores"
          subtitle="Posición en el campo de los jugadores"
        />
        <CourtView
          blueTeam={Object.values(props.report.data.players).map(
            (playerData) => playerData.locations[playerData.locations.length - 1]
          )}
        />

        {/* Cards Datos*/}
        <SectionTitle title="Estadísticas" />
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={secondsToTimeString(props.report.data.elapsedTime)}
            label="TIEMPO TRANSCURRIDO"
            progress={remainingTurnTimePercentage}
            progressColor="yellow"
          />
          <StatCard
            value={`${lanzamientosExitososPorcentaje}%`}
            label="LANZAMIENTOS EXITOSOS"
            progress={lanzamientosExitososPorcentaje}
            progressColor="blue"
          />
          <StatCard
            value={`${lanzamientosAlPorteroPorcentaje}%`}
            label="LANZAMIENTOS AL PORTERO"
            progress={lanzamientosAlPorteroPorcentaje}
            progressColor="red"
          />
          <StatCard
            value={`${lanzamientosFueraPorcentaje}%`}
            label="LANZAMIENTOS FUERA"
            progress={lanzamientosFueraPorcentaje}
            progressColor="red"
          />
        </div>

        {/* Ranking de xogadores */}
        <SectionTitle title="Ranking de jugadores" />
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
      {/* Renderizado condicional */}
      {props.player ? renderPlayerView(props.player) : renderGlobalView()}
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
    <Card className="p-2">
      <CardContent className="p-0">
        <div className="w-full relative border rounded-lg shadow-sm overflow-hidden">
          <img
            src={handballFieldImage}
            alt="Playing field background"
            className="w-full grayscale"
          />
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
      </CardContent>
    </Card>
  );
}
