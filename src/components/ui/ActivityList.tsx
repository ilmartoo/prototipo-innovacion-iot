import ActivitySummary from "@/components/ui/ActivitySummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/data/models/activity";
import type { ReactNode } from "react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "./empty";

interface ActivityListProps {
  children?: ReactNode;
  title?: string;
  activities: Activity[];
  isListing?: boolean;
  onActivityClick: (activity: Activity) => void;
  emptyText?: string;
  emptyAction?: ReactNode;
}

const dateNow = new Date();

export default function ActivityList(props: ActivityListProps) {
  function getDateOffset(date: Date): number {
    return (
      (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
        new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()).getTime()) /
      86400000
    );
  }

  function separateActivitiesByDate(activities: Activity[]): Record<string, Activity[]> {
    return activities.reduce(
      (record, activity) => {
        const offset = `${getDateOffset(activity.date)}`;
        if (record[offset]) {
          record[offset].push(activity);
        } else {
          record[offset] = [activity];
        }
        return record;
      },
      {} as Record<string, Activity[]>
    );
  }

  function getDateOffsetDisplayString(offset: string): string {
    if (offset === "0") {
      return "Hoy";
    } else if (offset === "1") {
      return "Mañana";
    } else if (offset === "-1") {
      return "Ayer";
    } else {
      const date = new Date(dateNow);
      date.setDate(date.getDate() + +offset);
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    }
  }

  const activities = separateActivitiesByDate(props.activities);

  return (
    <Card className="gap-0">
      <CardHeader className="block">
        {props.title && <CardTitle>{props.title}</CardTitle>}
        {props.children}
      </CardHeader>
      <CardContent>
        {props.activities.length ? (
          Object.keys(activities).map((offset, oi) => (
            <div key={oi} className="flex flex-col gap-4">
              <div className="pt-2 mt-4 border-t text-muted-foreground font-semibold text-sm">
                {getDateOffsetDisplayString(offset)}
              </div>
              {activities[offset].map((activity, ai) => (
                <ActivitySummary
                  key={ai}
                  activity={activity}
                  onIconClick={() => props.onActivityClick(activity)}
                  isListing={props.isListing}
                />
              ))}
            </div>
          ))
        ) : (
          <Empty className="pt-2 mt-4 border-t rounded-none border-solid">
            {props.emptyText && (
              <EmptyHeader>
                <EmptyDescription>{props.emptyText}</EmptyDescription>
              </EmptyHeader>
            )}
            {props.emptyAction && <EmptyContent>{props.emptyAction}</EmptyContent>}
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
