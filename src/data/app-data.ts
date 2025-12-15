import alba from "@/assets/alba.webp";
import barbara from "@/assets/barbara.webp";
import juan from "@/assets/juan.webp";
import paulina from "@/assets/paulina.png";
import samuel from "@/assets/samuel.webp";
import type { Activity } from "@/data/models/activity";
import type { ActivityRanking } from "@/data/models/activity-ranking";
import { calculateRanking } from "@/data/models/activity-ranking";
import type { User } from "@/data/models/user";

const dateNow = new Date();

function createDate(from: {
  set?: { year?: number; month?: number; day?: number; hour?: number; minutes?: number };
  offset?: { years?: number; months?: number; days?: number; hours?: number; minutes?: number };
}): Date {
  let date = new Date(dateNow);
  const { set, offset } = from;

  if (set?.year != null) {
    date.setFullYear(set.year);
  }
  if (set?.month != null) {
    date.setMonth(set.month - 1);
  }
  if (set?.day != null) {
    date.setDate(set.day);
  }
  if (set?.hour != null) {
    date.setHours(set.hour);
  }
  if (set?.minutes != null) {
    date.setMinutes(set.minutes);
  }

  if (offset?.years != null) {
    date.setFullYear(date.getFullYear() + offset.years);
  }
  if (offset?.months != null) {
    date.setMonth(date.getMonth() + offset.months);
  }
  if (offset?.days != null) {
    date.setDate(date.getDate() + offset.days);
  }
  if (offset?.hours != null) {
    date.setHours(date.getHours() + offset.hours);
  }
  if (offset?.minutes != null) {
    date.setMinutes(date.getMinutes() + offset.minutes);
  }

  return date;
}

function generateTemporalUserIds(size: number): string[] {
  return new Array(size).map((_, i) => "T" + i.toString().padStart(3, "0"));
}

export const users: User[] = [
  {
    id: "0000",
    name: "Paulina",
    surname: "Rodríguez Fariña",
    picture: paulina,
    level: 37,
    completedActivities: 14,
  },
  {
    id: "0001",
    name: "Juan",
    surname: "Garrido Cerezo",
    picture: juan,
    level: 28,
    completedActivities: 21,
  },
  {
    id: "0002",
    name: "Bárbara",
    surname: "Herrera Guerra",
    picture: barbara,
    level: 14,
    completedActivities: 9,
  },
  {
    id: "0003",
    name: "Alba",
    surname: "Quevedo Fernández",
    picture: alba,
    level: 45,
    completedActivities: 20,
  },
  {
    id: "0004",
    name: "Samuel",
    surname: "Laredo González",
    picture: samuel,
    level: 24,
    completedActivities: 2,
  },
];

export function getUserById(userId: string): User {
  return users.find((u) => u.id === userId)!;
}

export const currentUser = users[0];

export const activities: Activity[] = [
  {
    id: "0000",
    ownerId: "0000",
    title: "Balonmano y puntería",
    description:
      "Práctica de puntería en el Pabellón Municipal de Pontevedra. Necesario conocimientos mínimos de balonmano. Luego quizás podamos jugar una pachanga.",
    date: createDate({ offset: { minutes: -30 } }),
    maxParticipants: 10,
    started: true,
    finished: false,
  },
  {
    id: "0001",
    ownerId: "0001",
    title: "Un 21 con amigos",
    description:
      "Vamos a jugar un 21 y necesitamos a personas que les apetezca echarse unas partidas antes de un partido.",
    date: createDate({ offset: { hours: 2 }, set: { minutes: 30 } }),
    maxParticipants: 12,
    started: false,
    finished: false,
  },
  {
    id: "0002",
    ownerId: "0002",
    title: "Pachanga de baloncesto",
    description:
      "Pachanga de baloncesto en Parque Cataluña. Necesitamos a gente con un poco de nivel para poder practicar.",
    date: createDate({ offset: { days: 1 }, set: { hour: 17, minutes: 30 } }),
    maxParticipants: 14,
    started: false,
    finished: false,
  },
  {
    id: "0003",
    ownerId: "0003",
    title: "Partido de bádminton 2v2",
    description: "Buscamos pareja de bádminton para practicar de cara a un torneo amateur.",
    date: createDate({ offset: { days: 1 }, set: { hour: 19, minutes: 0 } }),
    maxParticipants: 4,
    started: false,
    finished: false,
  },
  {
    id: "0004",
    ownerId: "0004",
    title: "Baloncesto. ¿Alguien?",
    description:
      "Vamos a jugar un partido amistoso contra el grupo de IES Garrido. Necesitamos algunos miembros para suplir vacantes.",
    date: createDate({ offset: { days: 1 }, set: { hour: 21, minutes: 45 } }),
    maxParticipants: 8,
    started: false,
    finished: false,
  },
  {
    id: "0005",
    ownerId: "0003",
    title: "Balonmano y dianas",
    description: "Práctica de puntería en el Pabellón Municipal de Cangas.",
    date: createDate({ set: { month: 9, day: 9, hour: 18, minutes: 45 } }),
    maxParticipants: 10,
    started: false,
    finished: true,
  },
  {
    id: "0006",
    ownerId: "0001",
    title: "Vamos a jugar un Reloj",
    description: "Algunas rondas de un divertido Reloj antes de jugar un partido entre amigos.",
    date: createDate({ set: { month: 9, day: 10, hour: 18, minutes: 0 } }),
    maxParticipants: 16,
    started: false,
    finished: true,
  },
  {
    id: "0007",
    ownerId: "0000",
    title: "Pachanga de balonmano",
    description:
      "Pachanga entre amigos. Buscamos gente que sepa de balonmano para poder realizar cambios y probar cosas nuevas.",
    date: createDate({ set: { month: 9, day: 10, hour: 20, minutes: 30 } }),
    maxParticipants: 20,
    started: false,
    finished: true,
  },
];

export const activityParticipants: Record<Activity["id"], User["id"][]> = {
  "0000": ["0000", ...generateTemporalUserIds(4)],
  "0001": ["0000", "0001", ...generateTemporalUserIds(5)],
  "0002": ["0002", ...generateTemporalUserIds(10)],
  "0003": ["0003", ...generateTemporalUserIds(1)],
  "0004": ["0004", ...generateTemporalUserIds(4)],
  "0005": ["0000", "0003", ...generateTemporalUserIds(4)],
  "0006": ["0000", "0001", ...generateTemporalUserIds(10)],
  "0007": ["0000", ...generateTemporalUserIds(14)],
};

export function isUserInActivity(userId: string, activityId: string): boolean {
  return activityParticipants[activityId].includes(userId);
}

export function addUserToActivity(userId: string, activityId: string): void {
  if (!isUserInActivity(userId, activityId)) {
    activityParticipants[activityId].push(userId);
  }
}

export function removeUserFromActivity(userId: string, activityId: string): void {
  activityParticipants[activityId] = activityParticipants[activityId].filter((id) => id !== userId);
}

const rankings: Omit<ActivityRanking, "position">[] = [
  {
    id: "ranking_0000",
    userId: "0000",
    name: `${users[0].name} ${users[0].surname}`,
    picture: users[0].picture,
    goals: 4,
    playingPosition: "Extremo de",
  },
  {
    id: "ranking_0001",
    userId: "0001",
    name: `${users[1].name} ${users[1].surname}`,
    picture: users[1].picture,
    goals: 3,
    playingPosition: "Lateral iz",
  },
  {
    id: "ranking_0002",
    userId: "0002",
    name: `${users[2].name} ${users[2].surname}`,
    picture: users[2].picture,
    goals: 2,
    playingPosition: "Lateral de",
  },
  {
    id: "ranking_0003",
    userId: "0003",
    name: `${users[3].name} ${users[3].surname}`,
    picture: users[3].picture,
    goals: 6,
    playingPosition: "Extremo iz",
  },
  {
    id: "ranking_0004",
    userId: "0004",
    name: `${users[4].name} ${users[4].surname}`,
    picture: users[4].picture,
    goals: 1,
    playingPosition: "Central",
  },
];

export const activityRankings: ActivityRanking[] = calculateRanking(rankings);
