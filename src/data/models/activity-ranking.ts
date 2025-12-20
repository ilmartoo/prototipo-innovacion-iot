export type ActivityRankingPayload = string | number | boolean | object | undefined | null;

export interface ActivityRanking {
  userId: string;
  points: number;
  rank: number;
  payload: ActivityRankingPayload;
}

export type ActivityRankingPending = Omit<ActivityRanking, "rank">;

export function calculateRanking(
  rankings: ActivityRankingPending[]
): Record<string, ActivityRanking> {
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
