import { Item, ItemMedia, ItemTitle } from "@/components/ui/item";
import RefereeActions from "@/components/ui/RefereeActions";
import RefereeLog from "@/components/ui/RefereeLog";
import SectionTitle from "@/components/ui/SectionTitle";
import UserAvatar from "@/components/ui/UserAvatar";
import { getUserById, secondsToTimeString } from "@/data/app-data";
import type { ActivityReport } from "@/data/models/activity";
import type { User } from "@/data/models/user";
import { ClockIcon } from "lucide-react";

interface ActivityRefereeTabProps {
  report: ActivityReport;
}

export default function ActivityRefereeTab(props: ActivityRefereeTabProps) {
  const entries = [...props.report.referee].reverse();
  const participants = props.report.conditions.participants.reduce(
    (map, u) => ({ ...map, [u]: getUserById(u) }),
    {} as Record<string, User>
  );

  return (
    <>
      {/* Turno actual */}
      <SectionTitle title="Turno actual" subtitle="Información sobre el turno actual" />
      <Item variant="outline" className="shadow-sm flex flex-row items-center justify-between">
        <ItemTitle className="w-full">
          <ItemMedia>
            <ClockIcon className="size-4" />
          </ItemMedia>

          {props.report.data.turn.remainingTime != null && (
            <div className="text-base font-semibold">
              {secondsToTimeString(props.report.data.turn.remainingTime)} restantes
            </div>
          )}
          <div className="ml-auto">
            <span className="flex gap-1 items-center pl-0.5">
              <UserAvatar userId={props.report.data.turn.player} size={6} />{" "}
              <span>{participants[props.report.data.turn.player].name}</span>
            </span>
          </div>
        </ItemTitle>
      </Item>

      <SectionTitle title="Información de arbitraje" />
      <RefereeActions entries={entries.slice(0, 5)} participants={participants} />

      <SectionTitle title="Histórico de arbitraje" />
      <RefereeLog entries={entries} participants={participants} />
    </>
  );
}
