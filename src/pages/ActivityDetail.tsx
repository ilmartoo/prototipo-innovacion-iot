import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import TopBar from "@/components/ui/TopBar";
import {
  activityPlayerData,
  activityRankings,
} from "@/data/app-data";
import type { ActivityRanking } from "@/data/models/activity-ranking";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { getUserById } from "../data/app-data";



export default function ActivityDetail() {
  const { activity: activityId } = useParams();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [activeView, setActiveView] = useState<"live" | "summary">("live");

  const selectedPlayerData =
    (selectedPlayerId && activityRankings[activityId!][selectedPlayerId]) || null;

  function renderLivePlayerView(playerRanking: ActivityRanking<string>) {
    const user = getUserById(playerRanking.userId);
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Pantalla de EN VIVO - Jugador: {user.name} {user.surname}
        </h2>
      </div>
    );
  }

  function renderSummaryPlayerView(playerRanking: ActivityRanking<string>) {
    const user = getUserById(playerRanking.userId);
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Pantalla de RESUMEN - Jugador: {user.name} {user.surname}
        </h2>
      </div>
    );
  }

  function renderLiveGlobalView() {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Pantalla de EN VIVO - Global
        </h2>
      </div>
    );
  }

  function renderSummaryGlobalView() {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Pantalla de RESUMEN - Global
        </h2>
      </div>
    );
  }

  return (
    <>
      <TopBar title="Detalles de actividad" to="/">
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

      <div className="flex justify-center w-full mb-4">
        <NavigationMenu>
          <NavigationMenuList className="gap-8">
          <NavigationMenuItem>
            <NavigationMenuLink
              className={`cursor-pointer px-6 py-3 text-sm font-semibold uppercase tracking-wider ${activeView === "live" ? "bg-accent text-accent-foreground" : ""}`}
              onClick={() => setActiveView("live")}
            >
              EN VIVO
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={`cursor-pointer px-6 py-3 text-sm font-semibold uppercase tracking-wider ${activeView === "summary" ? "bg-accent text-accent-foreground" : ""}`}
              onClick={() => setActiveView("summary")}
            >
              RESUMEN
            </NavigationMenuLink>
          </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="space-y-6">
        {activeView === "live" 
          ? (selectedPlayerData ? renderLivePlayerView(selectedPlayerData) : renderLiveGlobalView())
          : (selectedPlayerData ? renderSummaryPlayerView(selectedPlayerData) : renderSummaryGlobalView())
        }
      </div>
    </>
  );
}

