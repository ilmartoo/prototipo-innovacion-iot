export interface Activity {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  date: Date;
  participants: number;
  maxParticipants: number;
  finished: boolean;
}

export function getActivityTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}
