import RefereeLog from "@/components/ui/RefereeLog";
import SectionTitle from "@/components/ui/SectionTitle";
import { getUserById } from "@/data/app-data";
import type { ActivityReport } from "@/data/models/activity";
import type { User } from "@/data/models/user";

interface ActivityRefereeTabProps {
  report: ActivityReport;
}

export default function ActivityHistoryTab(props: ActivityRefereeTabProps) {
  const entries = [...props.report.referee].reverse();
  const participants = props.report.conditions.participants.reduce(
    (map, u) => ({ ...map, [u]: getUserById(u) }),
    {} as Record<string, User>
  );

  return (
    <>
      <SectionTitle title="Histórico de arbitraje" />
      <RefereeLog entries={entries} participants={participants} />
    </>
  );
}
