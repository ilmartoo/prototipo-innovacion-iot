import ActivitySummary from "@/components/ui/ActivitySummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/data/models/activity";
import {
  activities,
  addUserToActivity,
  currentUser,
  getUserById,
  isUserInActivity,
  removeUserFromActivity,
} from "@/data/app-data";
import { Link } from "react-router";

export default function Home() {
  const now = new Date();

  function getDateOffset(date: Date): number {
    return Math.trunc((date.getTime() - now.getTime()) / 86400000);
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
      const date = new Date(now);
      date.setDate(date.getDate() + +offset);
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    }
  }

  const userActivities = separateActivitiesByDate(
    activities.filter((a) => isUserInActivity(currentUser.id, a.id) && !a.finished)
  );
  const nextActivities = separateActivitiesByDate(activities.filter((a) => a.date > now));

  function toggleUserActivity(userId: string, activityId: string): void {
    if (isUserInActivity(userId, activityId)) {
      removeUserFromActivity(userId, activityId);
    } else {
      addUserToActivity(userId, activityId);
    }
  }

  return (
    <div className="p-6">
      <Link to="activity/0000/live">
        <Button>View Activity Live Data</Button>
      </Link>

      <Card>
        <CardContent>
          <CardTitle>Tus actividades pendientes</CardTitle>
          {Object.keys(userActivities).map((offset, oi) => (
            <div key={oi} className="mt-2 border-t flex flex-col gap-4">
              <div className="py-2 text-muted-foreground">{getDateOffsetDisplayString(offset)}</div>
              {userActivities[offset].map((activity, ai) => (
                <ActivitySummary
                  key={ai}
                  activity={activity}
                  userPicture={getUserById(activity.ownerId).picture}
                  onIconClick={() => toggleUserActivity(activity.ownerId, activity.id)}
                />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
