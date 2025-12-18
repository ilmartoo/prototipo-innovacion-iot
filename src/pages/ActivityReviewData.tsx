import handballFieldImage from "@/assets/handball-field.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import RankingTable from "@/components/ui/RankingTable";
import StatCard from "@/components/ui/StatCard";
import TopBar from "@/components/ui/TopBar";
import { activityPlayerData, activityPlayerPositions, activityRankings } from "@/data/app-data";
import type { ActivityRanking } from "@/data/models/activity-ranking";
import type { Position } from "@/data/models/position";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { getUserById } from "../data/app-data";

export default function ActivitySummaryData() {
  const { activity: activityId } = useParams();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [isLanzamientosOpen, setIsLanzamientosOpen] = useState(true);
  const [isCentralOpen, setIsCentralOpen] = useState(true);
  const [isLateralOpen, setIsLateralOpen] = useState(false);

  const selectedPlayerData =
    (selectedPlayerId && activityRankings[activityId!][selectedPlayerId]) || null;

  function renderPlayerView(playerRanking: ActivityRanking<string>) {
    const playerPos = activityPlayerPositions[activityId!]?.[playerRanking.userId];
    const playerData = activityPlayerData[activityId!][playerRanking.userId];

    const lanzamientosExitososPorcentaje = +(
      (playerData.lanzamientos.aciertos /
        (playerData.lanzamientos.aciertos + playerData.lanzamientos.fallos)) *
      100
    ).toFixed(2);

    return (
      <>
        {playerPos && <CourtView blueTeam={[playerPos]} />}

        <div className="grid grid-cols-2 gap-4">
          <StatCard value="23s" label="TIEMPO MEDIO DE TURNO" progress={75} progressColor="red" />
          <StatCard
            value={`${lanzamientosExitososPorcentaje}%`}
            label="LANZAMIENTOS EXITOSOS"
            progress={lanzamientosExitososPorcentaje}
            progressColor="blue"
          />
          <StatCard value={playerRanking.points} label="GOLES" />
          <StatCard value={`${playerData.distanciaTiro.media}m`} label="DISTANCIA MEDIA DE TIRO" />
        </div>

        <div className="space-y-4">
          <Collapsible
            open={isLanzamientosOpen}
            onOpenChange={setIsLanzamientosOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="text-lg font-semibold">Lanzamientos</h3>
                    <p className="text-sm text-muted-foreground">
                      Analiza los lanzamientos desde posiciones
                    </p>
                  </div>
                  {isLanzamientosOpen ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </CardContent>
              </Card>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2 space-y-2">
              <Collapsible open={isCentralOpen} onOpenChange={setIsCentralOpen}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="text-lg font-medium">Central</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">2</span>
                        {isCentralOpen ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-2">
                  <Card>
                    <CardContent className="p-0">
                      <ItemGroup>
                        <Item>
                          <ItemContent>
                            <ItemTitle>Lanzamientos por encima de la cintura</ItemTitle>
                          </ItemContent>
                          <ItemActions>
                            <span className="font-semibold">2</span>
                          </ItemActions>
                        </Item>
                        <Item>
                          <ItemContent>
                            <ItemTitle>Lanzamientos exitosos</ItemTitle>
                          </ItemContent>
                          <ItemActions>
                            <span className="font-semibold">1/2</span>
                          </ItemActions>
                        </Item>
                      </ItemGroup>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={isLateralOpen} onOpenChange={setIsLateralOpen}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="text-lg font-medium">Lateral derecho</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">4</span>
                        {isLateralOpen ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-2">
                  <Card>
                    <CardContent className="p-0">
                      <ItemGroup>
                        <Item>
                          <ItemContent>
                            <ItemTitle>Lanzamientos por encima de la cintura</ItemTitle>
                          </ItemContent>
                          <ItemActions>
                            <span className="font-semibold">3</span>
                          </ItemActions>
                        </Item>
                        <Item>
                          <ItemContent>
                            <ItemTitle>Lanzamientos exitosos</ItemTitle>
                          </ItemContent>
                          <ItemActions>
                            <span className="font-semibold">2/4</span>
                          </ItemActions>
                        </Item>
                      </ItemGroup>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </>
    );
  }

  function renderGlobalView() {
    const rankings = Object.values(activityRankings[activityId!]);
    const winner = rankings.find((ranking) => ranking.rank === 1);
    const winnerUser = winner ? getUserById(winner.userId) : null;

    const playerStats = activityPlayerData[activityId!];
    let longestWinStreak = { player: "", streak: 0 };
    let longestLossStreak = { player: "", streak: 0 };

    Object.entries(playerStats).forEach(([userId, data]) => {
      const user = getUserById(userId);
      if (data.rachaDeAciertos > longestWinStreak.streak) {
        longestWinStreak = { player: user.name, streak: data.rachaDeAciertos };
      }
      const lossStreak = data.lanzamientos.fallos;
      if (lossStreak > longestLossStreak.streak) {
        longestLossStreak = { player: user.name, streak: lossStreak };
      }
    });

    return (
      <>
        {winnerUser && winner && (
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">
              {winnerUser.name} {winnerUser.surname.charAt(0)}.
            </h1>
            <p className="text-muted-foreground text-lg">HA GANADO CON {winner.points} GOLES</p>
          </div>
        )}

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

        <RankingTable
          labels={{
            value: "Goles",
            subject: "Jugador",
            extra: "Posición",
          }}
          rankings={activityRankings[activityId!]}
        />
      </>
    );
  }

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

  return (
    <div className="w-full relative border rounded-lg shadow-sm overflow-hidden mb-6">
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
