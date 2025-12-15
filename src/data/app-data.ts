import alba from "@/assets/alba.webp";
import barbara from "@/assets/barbara.webp";
import juan from "@/assets/juan.webp";
import paulina from "@/assets/paulina.png";
import samuel from "@/assets/samuel.webp";
import type { Activity, ActivityData, ActivityPlayerData } from "@/data/models/activity";
import type { ActivityRanking } from "@/data/models/activity-ranking";
import { calculateRanking } from "@/data/models/activity-ranking";
import type { Position } from "@/data/models/position";
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
  return new Array(size).map((_, i) => "U-T" + i.toString().padStart(3, "0"));
}

export const users: User[] = [
  {
    id: "U-0000",
    name: "Paulina",
    surname: "Rodríguez Fariña",
    picture: paulina,
    level: 37,
    completedActivities: 14,
  },
  {
    id: "U-0001",
    name: "Juan",
    surname: "Garrido Cerezo",
    picture: juan,
    level: 28,
    completedActivities: 21,
  },
  {
    id: "U-0002",
    name: "Bárbara",
    surname: "Herrera Guerra",
    picture: barbara,
    level: 14,
    completedActivities: 9,
  },
  {
    id: "U-0003",
    name: "Alba",
    surname: "Quevedo Fernández",
    picture: alba,
    level: 45,
    completedActivities: 20,
  },
  {
    id: "U-0004",
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
    id: "A-0000",
    ownerId: "U-0000",
    title: "Balonmano y puntería",
    description:
      "Práctica de puntería en el Pabellón Municipal de Pontevedra. Necesario conocimientos mínimos de balonmano. Luego quizás podamos jugar una pachanga.",
    date: createDate({ offset: { minutes: -30 } }),
    maxParticipants: 10,
    started: true,
    finished: false,
  },
  {
    id: "A-0001",
    ownerId: "U-0001",
    title: "Un 21 con amigos",
    description:
      "Vamos a jugar un 21 y necesitamos a personas que les apetezca echarse unas partidas antes de un partido.",
    date: createDate({ offset: { hours: 2 }, set: { minutes: 30 } }),
    maxParticipants: 12,
    started: false,
    finished: false,
  },
  {
    id: "A-0002",
    ownerId: "U-0002",
    title: "Pachanga de baloncesto",
    description:
      "Pachanga de baloncesto en Parque Cataluña. Necesitamos a gente con un poco de nivel para poder practicar.",
    date: createDate({ offset: { days: 1 }, set: { hour: 17, minutes: 30 } }),
    maxParticipants: 14,
    started: false,
    finished: false,
  },
  {
    id: "A-0003",
    ownerId: "U-0003",
    title: "Partido de bádminton 2v2",
    description: "Buscamos pareja de bádminton para practicar de cara a un torneo amateur.",
    date: createDate({ offset: { days: 1 }, set: { hour: 19, minutes: 0 } }),
    maxParticipants: 4,
    started: false,
    finished: false,
  },
  {
    id: "A-0004",
    ownerId: "U-0004",
    title: "Baloncesto. ¿Alguien?",
    description:
      "Vamos a jugar un partido amistoso contra el grupo de IES Garrido. Necesitamos algunos miembros para suplir vacantes.",
    date: createDate({ offset: { days: 1 }, set: { hour: 21, minutes: 45 } }),
    maxParticipants: 8,
    started: false,
    finished: false,
  },
  {
    id: "A-0005",
    ownerId: "U-0003",
    title: "Balonmano y dianas",
    description: "Práctica de puntería en el Pabellón Municipal de Cangas.",
    date: createDate({ set: { month: 9, day: 9, hour: 18, minutes: 45 } }),
    maxParticipants: 10,
    started: false,
    finished: true,
  },
  {
    id: "A-0006",
    ownerId: "U-0001",
    title: "Vamos a jugar un Reloj",
    description: "Algunas rondas de un divertido Reloj antes de jugar un partido entre amigos.",
    date: createDate({ set: { month: 9, day: 10, hour: 18, minutes: 0 } }),
    maxParticipants: 16,
    started: false,
    finished: true,
  },
  {
    id: "A-0007",
    ownerId: "U-0000",
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
  "A-0000": ["U-0000", ...generateTemporalUserIds(4)],
  "A-0001": ["U-0000", "U-0001", ...generateTemporalUserIds(5)],
  "A-0002": ["U-0002", ...generateTemporalUserIds(10)],
  "A-0003": ["U-0003", ...generateTemporalUserIds(1)],
  "A-0004": ["U-0004", ...generateTemporalUserIds(4)],
  "A-0005": ["U-0000", "U-0003", ...generateTemporalUserIds(4)],
  "A-0006": ["U-0000", "U-0001", ...generateTemporalUserIds(10)],
  "A-0007": ["U-0000", ...generateTemporalUserIds(14)],
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

export const activityRankings: Record<string, Record<string, ActivityRanking<string>>> = {
  "A-0000": calculateRanking([
    {
      id: "R-0000",
      userId: "U-0000",
      points: 4,
      payload: "Extremo D",
    },
    {
      id: "R-0001",
      userId: "U-0001",
      points: 3,
      payload: "Lateral I",
    },
    {
      id: "R-0002",
      userId: "U-0002",
      points: 2,
      payload: "Lateral D",
    },
    {
      id: "R-0003",
      userId: "U-0003",
      points: 6,
      payload: "Extremo I",
    },
    {
      id: "R-0004",
      userId: "U-0004",
      points: 1,
      payload: "Central",
    },
  ]),
};

export const activityPlayerPositions: Record<string, Record<string, Position>> = {
  "A-0000": {
    "U-0000": { x: 169, y: 120 },
    "U-0001": { x: 254, y: 80 },
    "U-0002": { x: 211, y: 241 },
    "U-0003": { x: 148, y: 321 },
    "U-0004": { x: 464, y: 160 },
  },
};

export const activityData: Record<string, ActivityData> = {
  "A-0000": {
    tiempo: 823,
    turno: {
      jugadorId: "U-0004",
      tiempoRestante: 13,
    },
  },
};

export const activityPlayerData: Record<string, Record<string, ActivityPlayerData>> = {
  "A-0000": {
    "U-0000": {
      turno: {
        tiempoActual: 65,
        totalEnPosicionActual: 2,
      },
      lanzamientos: {
        aciertos: 4,
        fallos: 2,
      },
      rachaDeAciertos: 2,
      distanciaTiro: {
        media: 6.44,
        actual: 7.22,
      },
    },
    "U-0001": {
      turno: {
        tiempoActual: 56,
        totalEnPosicionActual: 1,
      },
      lanzamientos: {
        aciertos: 3,
        fallos: 3,
      },
      rachaDeAciertos: 1,
      distanciaTiro: {
        media: 7.01,
        actual: 6.92,
      },
    },
    "U-0002": {
      turno: {
        tiempoActual: 82,
        totalEnPosicionActual: 3,
      },
      lanzamientos: {
        aciertos: 2,
        fallos: 4,
      },
      rachaDeAciertos: 0,
      distanciaTiro: {
        media: 6.23,
        actual: 6.45,
      },
    },
    "U-0003": {
      turno: {
        tiempoActual: 49,
        totalEnPosicionActual: 1,
      },
      lanzamientos: {
        aciertos: 6,
        fallos: 0,
      },
      rachaDeAciertos: 2,
      distanciaTiro: {
        media: 6.42,
        actual: 6.58,
      },
    },
    "U-0004": {
      turno: {
        tiempoActual: 96,
        totalEnPosicionActual: 4,
      },
      lanzamientos: {
        aciertos: 1,
        fallos: 5,
      },
      rachaDeAciertos: 0,
      distanciaTiro: {
        media: 6.67,
        actual: 6.22,
      },
    },
  },
};
