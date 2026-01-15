import ActivityList from "@/components/ui/ActivityList";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  activities,
  activityParticipants,
  addUserToActivity,
  currentUser,
  getUserById,
  isUserInActivity,
  removeUserFromActivity,
} from "@/data/app-data";
import type { Activity } from "@/data/models/activity";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const dateNow = new Date();

export default function Home() {
  const navigate = useNavigate();
  const [allActivities, setAllActivities] = useState(activities);
  const [search, setSearch] = useState<string>("");

  function isActivityInSearch(activity: Activity): boolean {
    const searchLower = search.toLowerCase();
    
    // Buscar título y descripción de la actividad
    const titleMatch = activity.title.toLowerCase().includes(searchLower);
    const descriptionMatch = activity.description.toLowerCase().includes(searchLower);
    
    // Buscar nombres de participantes
    const participantNames = activityParticipants[activity.id]
      ?.map(participantId => {
        const user = getUserById(participantId);
        return user ? `${user.name} ${user.surname}`.toLowerCase() : '';
      })
      .filter(name => name !== '') || [];
    
    const participantMatch = participantNames.some(name => name.includes(searchLower));
    return titleMatch || descriptionMatch || participantMatch;
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
    navigate(`/activity/${activity.id}`);
  }

  function toggleCurrentUserOnActivity(activity: Activity): void {
    const wasInActivity = isUserInActivity(currentUser.id, activity.id);
    
    if (wasInActivity) {
      removeUserFromActivity(currentUser.id, activity.id);
      setAllActivities([...allActivities]);
      
      toast.success(`Te has retirado de "${activity.title}"`, {
        action: {
          label: "Deshacer",
          onClick: () => {
            addUserToActivity(currentUser.id, activity.id);
            setAllActivities([...allActivities]);
            toast.success(`Te has unido nuevamente a "${activity.title}"`);
          },
        },
      });
      
    } else {
      addUserToActivity(currentUser.id, activity.id);
      setAllActivities([...allActivities]);
      
      toast.success(`Te has unido a "${activity.title}"`, {
        action: {
          label: "Deshacer",
          onClick: () => {
            removeUserFromActivity(currentUser.id, activity.id);
            setAllActivities([...allActivities]);
            toast.success(`Te has retirado de "${activity.title}"`);
          },
        },
      });
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
