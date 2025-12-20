import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs } from "@/components/ui/tabs";
import TopBar from "@/components/ui/TopBar";
import type { User } from "@/data/models/user";
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { activityParticipants, defaultActivity, getUserById } from "../data/app-data";
import ActivityLiveData from "./ActivityLiveData";
import ActivitySummaryData from "./ActivitySummaryData";

export default function ActivityDetail() {
  // const { activity: activityId } = useParams();
  const [selectedPlayer, setSelectedPlayer] = useState<User | undefined>();

  const activity = defaultActivity;

  return (
    <>
      <TopBar title="Detalles de actividad" to="/">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-32 justify-between text-sm">
              {selectedPlayer ? selectedPlayer.name : "Global"}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSelectedPlayer(undefined)}>
                Global
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-sm italic font-medium text-muted-foreground">
                Jugadores
              </DropdownMenuLabel>
              {activityParticipants[activity.id].map((userId) => {
                const user = getUserById(userId);
                return (
                  <DropdownMenuItem key={userId} onClick={() => setSelectedPlayer(user)}>
                    {user.name} {user.surname}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TopBar>

      <Tabs defaultValue={activity.started && !activity.finished ? "live" : "summary"}>
        <TabsList className="rounded-sm bg-muted grid grid-cols-2 h-10 p-1">
          <TabsTrigger
            className="rounded-sm data-[state=active]:shadow-sm data-[state=active]:bg-white"
            value="summary"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger
            className="rounded-sm data-[state=active]:shadow-sm data-[state=active]:bg-white"
            value="live"
            disabled={!activity.started || activity.finished}
          >
            Live
          </TabsTrigger>
        </TabsList>

        {/* Summary tab */}
        <TabsContent value="summary">
          <ActivitySummaryData activityId={activity.id} player={selectedPlayer} />
        </TabsContent>

        {/* Live tab */}
        <TabsContent value="live">
          <ActivityLiveData activityId={activity.id} player={selectedPlayer} />
        </TabsContent>
      </Tabs>
    </>
  );
}
