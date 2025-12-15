import handballFieldImage from "@/assets/handball-field.webp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import StatCard from "@/components/ui/StatCard";
import TopBar from "@/components/ui/TopBar";
import { activityRankings, users } from "@/data/app-data";
import { ChevronDown, Clock } from "lucide-react";
import { useState } from "react";

interface Position {
  x: number;
  y: number;
}

const playerPositions: Record<string, Position> = {
  "0000": { x: 169, y: 120 },
  "0001": { x: 254, y: 80 },
  "0002": { x: 211, y: 241 },
  "0003": { x: 148, y: 321 },
  "0004": { x: 464, y: 160 },
};

export default function ActivityData() {
  const [selectedPlayer, setSelectedPlayer] = useState("global");

  const playersData = activityRankings.map((ranking) => ({
    id: ranking.position,
    name: ranking.name
      .split(" ")
      .slice(0, 2)
      .map((n, i) => (i === 0 ? n : n[0] + "."))
      .join(" "),
    goals: ranking.goals,
    position: ranking.playingPosition,
    avatar: ranking.picture,
    userId: ranking.userId,
  }));

  const selectedPlayerData =
    selectedPlayer !== "global" ? playersData.find((p) => p.userId === selectedPlayer) : null;

  const renderPlayerView = () => {
    if (!selectedPlayerData) return null;

    return (
      <>
        {/* Campo de juego */}
        <CourtView blueTeam={[playerPositions[selectedPlayer]]} />

        {/* Estadísticas do xogador */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard value="23 s" label="TIEMPO TURNO" progress={75} progressColor="red" />
          <StatCard value="2" label="TURNOS EN POSICIÓN ACTUAL" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard value="60%" label="LANZAMIENTOS EXITOSOS" progress={60} progressColor="blue" />
          <StatCard value="2" label="TIROS FUERA" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard value={`${selectedPlayerData.goals}`} label="GOLES" />
          <StatCard value="2" label="RACHA DE GOLES" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard value="3,44 m" label="DISTANCIA MEDIA DE TIRO" />
          <StatCard value="5,13 m" label="DISTANCIA ACTUAL" />
        </div>
      </>
    );
  };

  return (
    <>
      <TopBar title="Datos de actividad" titleClassName="text-lg font-bold tracking-tight">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-32 justify-between text-sm">
              {selectedPlayer === "global"
                ? "Global"
                : users.find((u) => u.id === selectedPlayer)?.name || "Seleccionar"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuItem onClick={() => setSelectedPlayer("global")}>Global</DropdownMenuItem>
            {users.map((user) => (
              <DropdownMenuItem key={user.id} onClick={() => setSelectedPlayer(user.id)}>
                {user.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TopBar>

      {/* Renderizado condicional */}
      {selectedPlayer === "global" ? (
        <>
          {/* Campo de juego */}
          <CourtView blueTeam={Object.values(playerPositions)} />

          {/* Card - Turno actual */}
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Turno actual</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-muted-foreground mx-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">13 s restantes</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  SAMUEL L.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards Datos*/}
          <div className="grid grid-cols-2 gap-4">
            <StatCard value="13m 45s" label="TIEMPO - 15 MIN" progress={75} progressColor="red" />
            <StatCard
              value="60%"
              label="LANZAMIENTOS EXITOSOS"
              progress={60}
              progressColor="blue"
            />
          </div>

          {/* Ranking de xogadores */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Ranking</h2>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between px-4 pb-3 text-sm font-medium text-muted-foreground border-b">
                  <div className="w-1/5">Goles</div>
                  <div className="flex-1">Jugador</div>
                  <div>Posición</div>
                </div>

                {playersData.map((player, index) => (
                  <div key={player.id}>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="w-1/5 text-lg font-semibold">{player.goals}</div>
                      <div className="flex-1 flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback>
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{player.name}</span>
                      </div>
                      <div className="text-muted-foreground">{player.position}</div>
                    </div>
                    {index < playersData.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        renderPlayerView()
      )}
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
        {props.blueTeam?.map((p) => (
          <circle
            cx={p.x + playingFieldStart.x}
            cy={p.y + playingFieldStart.y}
            r="12"
            className="fill-blue-500 stroke-2 stroke-white"
          />
        ))}
        {props.redTeam?.map((p) => (
          <circle
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
