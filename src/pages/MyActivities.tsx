import ActivityList from "@/components/ui/ActivityList";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import TopBar from "@/components/ui/TopBar";
import { activities, currentUser, isUserInActivity } from "@/data/app-data";
import type { Activity } from "@/data/models/activity";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { useNavigate } from "react-router";

export default function MyActivities() {
  const [search, setSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const navigate = useNavigate();

  function isActivityInSearch(activity: Activity): boolean {
    return (
      activity.title.toLowerCase().includes(search) ||
      activity.description.toLowerCase().includes(search)
    );
  }

  function activityInDateRange(activity: Activity) {
    if (!dateRange || !dateRange.from || !dateRange.to) {
      return true;
    }

    let { from, to } = dateRange;
    to = new Date(to);
    to.setDate(to.getDate() + 1);

    return from <= activity.date && to > activity.date;
  }

  const myActivities = activities.filter(
    (activ) =>
      isUserInActivity(currentUser.id, activ.id) &&
      isActivityInSearch(activ) &&
      activityInDateRange(activ)
  );

  function navigateToActivity(activity: Activity): void {
    if (activity.started && !activity.finished) {
      navigate(`/activity/${activity.id}/live`);
    } else {
      navigate(`/activity/${activity.id}/review`);
    }
  }

  return (
    <>
      <TopBar title="Mis actividades" to="/" />

      <Card>
        <CardContent>
          <Calendar
            className="w-full"
            mode="range"
            captionLayout="label"
            selected={dateRange}
            onSelect={(d) => {
              console.log(d);
              setDateRange(d);
            }}
          />
        </CardContent>
      </Card>

      <ActivityList activities={myActivities} onActivityClick={navigateToActivity}>
        <InputGroup>
          <InputGroupInput
            placeholder="Buscar actividades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </ActivityList>
    </>
  );
}
