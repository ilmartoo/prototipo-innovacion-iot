import ActivityList from "@/components/ui/ActivityList";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  activities,
  activityParticipants,
  addUserToActivity,
  currentUser,
  isUserInActivity,
  removeUserFromActivity,
} from "@/data/app-data";
import type { Activity } from "@/data/models/activity";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const dateNow = new Date();

export default function Home() {
  const navigate = useNavigate();
  const [allActivities, setAllActivities] = useState(activities);
  const [search, setSearch] = useState<string>("");

  function isActivityInSearch(activity: Activity): boolean {
    return (
      activity.title.toLowerCase().includes(search) ||
      activity.description.toLowerCase().includes(search)
    );
  }

  const pendingUserActivities: Activity[] = [];
  const nextAvailableActivities: Activity[] = [];

  allActivities.forEach((activ) => {
    if (isActivityInSearch(activ)) {
      if (isUserInActivity(currentUser.id, activ.id) && !activ.finished) {
        pendingUserActivities.push(activ);
      }
      if (
        !activ.started &&
        activ.date > dateNow &&
        activityParticipants[activ.id].length < activ.maxParticipants
      ) {
        nextAvailableActivities.push(activ);
      }
    }
  });

  function navigateToActivity(activity: Activity): void {
    if (activity.started && !activity.finished) {
      navigate(`/activity/${activity.id}/live`);
    } else {
      navigate(`/activity/${activity.id}/summary`);
    }
    //navigate(`/activity/${activity.id}/detail`);
  }

  function toggleCurrentUserOnActivity(activity: Activity): void {
    if (isUserInActivity(currentUser.id, activity.id)) {
      removeUserFromActivity(currentUser.id, activity.id);
      setAllActivities([...allActivities]);
    } else {
      addUserToActivity(currentUser.id, activity.id);
      setAllActivities([...allActivities]);
    }
  }

  return (
    <>
      <Button asChild className="w-full">
        <Link to="/create-activity">Crear una actividad</Link>
      </Button>

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

      <ActivityList
        title="Tus próximas actividades"
        activities={pendingUserActivities}
        onActivityClick={navigateToActivity}
        emptyText="No tienes actividades futuras"
        emptyAction={
          <Button asChild variant="outline">
            <Link to="/create-activity">Crea una actividad</Link>
          </Button>
        }
      />

      <ActivityList
        title="Actividades que buscan participantes"
        activities={nextAvailableActivities}
        isListing
        onActivityClick={toggleCurrentUserOnActivity}
        emptyText="No existen actividades que busquen participantes"
      />
    </>
  );
}
