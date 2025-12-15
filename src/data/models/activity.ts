export interface Activity {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  date: Date;
  maxParticipants: number;
  started: boolean;
  finished: boolean;
}

export function getActivityTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export interface ActivityData {
  tiempo: number;
  turno: {
    jugadorId: string;
    tiempoRestante: number;
  };
}

export interface ActivityPlayerData {
  turno: {
    tiempoActual: number;
    totalEnPosicionActual: number;
  };
  lanzamientos: {
    aciertos: number;
    fallos: number;
  };
  rachaDeAciertos: number;
  distanciaTiro: {
    media: number;
    actual: number;
  };
}
