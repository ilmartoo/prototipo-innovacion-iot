export interface ActivityRanking<T> {
  id: string;
  userId: string;
  points: number;
  rank: number;
  payload: T;
}

export type ActivityRankingPending<T> = Omit<ActivityRanking<T>, "rank">;

export function calculateRanking<T>(
  rankings: ActivityRankingPending<T>[]
): Record<string, ActivityRanking<T>> {
  return rankings
    .sort((a, b) => b.points - a.points)
    .reduce(
      (map, current, index) => ({
        ...map,
        [current.userId]: { ...current, rank: index + 1 },
      }),
      {}
    );
}
