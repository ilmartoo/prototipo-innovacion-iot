import activityReportJSON from "@/assets/activity-data/A-0000.json";
import ActivityHistoryTab from "@/components/ui/ActivityHistoryTab";
import ActivityLiveTab from "@/components/ui/ActivityLiveTab";
import ActivityRefereeTab from "@/components/ui/ActivityRefereeTab";
import ActivitySummaryTab from "@/components/ui/ActivitySummaryTab";
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopBar from "@/components/ui/TopBar";
import {
  activityParticipants,
  defaultActivity,
  getActivityById,
  getUserById,
} from "@/data/app-data";
import type { ActivityReport } from "@/data/models/activity";
import {
  processExistingRealTimeData,
  processRealTimeEvent,
  processTimePassing,
  type RealTimeEvent,
} from "@/data/models/real-time";
import type { User } from "@/data/models/user";
import { CalendarClockIcon, CalendarIcon, ChevronDown, ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const activityRealTimeEvents = (activityReportJSON as RealTimeEvent[]).sort(
  (a, b) => a.timestamp - b.timestamp
);

const tabsNotFinished = {
  "Tiempo real": "live",
  Arbitraje: "referee",
} as const;

const tabsFinished = {
  Resumen: "summary",
  Histórico: "history",
} as const;

export default function ActivityDetail() {
  const { activity: pathActivityId } = useParams();

  const selectedActivity = getActivityById(pathActivityId!);
  const activity = defaultActivity;
  const isDefaultActivity = selectedActivity.id === defaultActivity.id;

  const timeTick = 0.2; // Paso entre procesados en segundos
  const startTimestamp = isDefaultActivity ? 120 : undefined; // Tiempo de fin de preprocesado en segundos

  const [selectedPlayer, setSelectedPlayer] = useState<User | undefined>();
  const [report, setReport] = useState(
    processExistingRealTimeData(
      {
        participants: activityParticipants[activity.id],
        gamePositions: [
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
      activityRealTimeEvents,
      startTimestamp
    )
  );

  function processTimeTick(report: ActivityReport, onWin: () => void): ActivityReport {
    const targetTime = report.data.elapsedTime + timeTick;
    const events = activityRealTimeEvents.filter(
      (e) => e.timestamp > report.data.elapsedTime && e.timestamp <= targetTime
    );

    let lastTimestamp = report.data.elapsedTime;
    for (let i = 0; i < events.length && !report.winning.player; ++i) {
      const event = events[i];
      const elapsedTime = event.timestamp - lastTimestamp;

      if (elapsedTime > 0) {
        processTimePassing(elapsedTime, report);
      }
      processRealTimeEvent(event, report);

      lastTimestamp = event.timestamp;
    }

    const remainingTimeToTarget = targetTime - lastTimestamp;
    if (remainingTimeToTarget > 0) {
      processTimePassing(remainingTimeToTarget, report);
    }

    if (report.winning.player) {
      onWin();
    }

    return { ...report };
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setReport((report) => processTimeTick(report, () => clearInterval(intervalId)));
    }, timeTick * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {selectedActivity.started ? (
        <>
          <TopBar title="Detalles de actividad" to="/">
            <PlayerSelection
              selected={selectedPlayer}
              participants={activityParticipants[activity.id].map((u) => getUserById(u))}
              onChange={setSelectedPlayer}
            />
          </TopBar>

          <Tabs
            defaultValue={isDefaultActivity ? tabsNotFinished["Tiempo real"] : tabsFinished.Resumen}
          >
            <TabsList className="rounded-sm w-full bg-muted grid grid-cols-2 h-10 p-1">
              {Object.entries(isDefaultActivity ? tabsNotFinished : tabsFinished).map(
                ([title, value]) => (
                  <TabsTrigger
                    key={value}
                    className="rounded-sm font-semibold text-sm tracking-tight data-[state=active]:shadow-sm data-[state=active]:bg-white disabled:text-muted-foreground"
                    value={value}
                  >
                    {title}
                  </TabsTrigger>
                )
              )}
            </TabsList>
            <div className="*:flex *:flex-col *:gap-4">
              {isDefaultActivity ? (
                <>
                  {/* Tiempo real tab */}
                  <TabsContent value={tabsNotFinished["Tiempo real"]}>
                    <ActivityLiveTab report={report} player={selectedPlayer} />
                  </TabsContent>

                  {/* Arbitraje tab */}
                  <TabsContent value={tabsNotFinished.Arbitraje}>
                    <ActivityRefereeTab report={report} />
                  </TabsContent>
                </>
              ) : (
                <>
                  {/* Resumen tab */}
                  <TabsContent value={tabsFinished.Resumen}>
                    <ActivitySummaryTab report={report} player={selectedPlayer} />
                  </TabsContent>

                  {/* Historico tab */}
                  <TabsContent value={tabsFinished.Histórico}>
                    <ActivityHistoryTab report={report} />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-12">
              <CalendarClockIcon className="size-8" strokeWidth={1.5} />
            </EmptyMedia>
            <EmptyTitle>La actividad aún no ha comenzado</EmptyTitle>
            <EmptyDescription>
              Comienza el{" "}
              <div className="inline-block align-middle pb-1.25 pr-0.75">
                <CalendarIcon className="size-4" />
              </div>
              <span className="font-semibold">{selectedActivity.date.toLocaleDateString()}</span> a
              las{" "}
              <div className="inline-block align-middle pb-1 pr-0.75">
                <ClockIcon className="size-4" />
              </div>
              <span className="font-semibold">
                {selectedActivity.date.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="gap-2">
            <EmptyDescription>Mientras esperas:</EmptyDescription>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild>
                <Link to="/">Busca actividades</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/create-activity">Crea una actividad</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      )}
    </>
  );
}

interface PlayerSelectionProps {
  selected?: User;
  participants: User[];
  onChange: (user?: User) => void;
}

function PlayerSelection(props: PlayerSelectionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-32 justify-between text-sm">
          {props.selected ? props.selected.name : "Global"}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => props.onChange(undefined)}>Global</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm italic font-medium text-muted-foreground">
            Jugadores
          </DropdownMenuLabel>
          {props.participants.map((user) => (
            <DropdownMenuItem key={user.id} onClick={() => props.onChange(user)}>
              {user.name} {user.surname}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
