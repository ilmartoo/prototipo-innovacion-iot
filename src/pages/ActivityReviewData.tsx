import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RankingTable from "@/components/ui/RankingTable";
import StatCard from "@/components/ui/StatCard";
import TopBar from "@/components/ui/TopBar";
import {
  activityPlayerData,
  activityRankings,
} from "@/data/app-data";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { getUserById } from "../data/app-data";

export default function ActivityReviewData() {
  const { activity: activityId } = useParams();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  // Obtener el ganador (el jugador con más puntos)
  const rankings = Object.values(activityRankings[activityId!]);
  const winner = rankings.find(ranking => ranking.rank === 1);
  const winnerUser = winner ? getUserById(winner.userId) : null;

  // Calcular estadísticas de rachas
  const playerStats = activityPlayerData[activityId!];
  let longestWinStreak = { player: "", streak: 0 };
  let longestLossStreak = { player: "", streak: 0 };

  Object.entries(playerStats).forEach(([userId, data]) => {
    const user = getUserById(userId);
    if (data.rachaDeAciertos > longestWinStreak.streak) {
      longestWinStreak = { player: user.name, streak: data.rachaDeAciertos };
    }
    // Para racha negativa, usamos los fallos como aproximación
    const lossStreak = data.lanzamientos.fallos;
    if (lossStreak > longestLossStreak.streak) {
      longestLossStreak = { player: user.name, streak: lossStreak };
    }
  });

  return (
    <>
      <TopBar title="Datos de partida" to="/">
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

      {/* Ganador */}
      {winnerUser && winner && (
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">{winnerUser.name} {winnerUser.surname.charAt(0)}.</h1>
          <p className="text-muted-foreground text-lg">HA GANADO CON {winner.points} GOLES</p>
        </div>
      )}

      {/* Estadísticas destacadas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          value={longestWinStreak.streak}
          label="RACHA DE GOLES MAS LARGA"
          subtitle={longestWinStreak.player}
          className="text-center"
        />
        <StatCard
          value={longestLossStreak.streak}
          label="RACHA NEGATIVA MAS LARGA"
          subtitle={longestLossStreak.player}
          className="text-center"
        />
      </div>

      {/* Tabla de ranking */}
      <RankingTable rankings={activityRankings[activityId!]} />
    </>
  );
}