export interface ActivityRanking {
  id: string;
  userId: string;
  name: string;
  picture: string;
  goals: number;
  position: number;
  playingPosition: string;
}

export function calculateRanking(rankings: Omit<ActivityRanking, "position">[]): ActivityRanking[] {
  return rankings
    .sort((a, b) => b.goals - a.goals)
    .map((ranking, index) => ({
      ...ranking,
      position: index + 1,
    }));
}