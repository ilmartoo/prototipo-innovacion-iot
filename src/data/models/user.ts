export interface User {
  id: string;
  name: string;
  surname: string;
  picture: string;
  level: number;
  completedActivities: number;
}

export function activitiesToNextLevel(level: number, completedActivities: number): number {
  return level - completedActivities;
}
