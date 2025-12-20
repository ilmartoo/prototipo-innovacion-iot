import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserAvatar from "@/components/ui/UserAvatar";
import { getUserById } from "@/data/app-data";
import type { ActivityRanking, ActivityRankingPayload } from "@/data/models/activity-ranking";
import type { ReactNode } from "react";

interface RankingTableProps {
  rankings: Record<string, ActivityRanking>;
  className?: string;
  /**
   * simple → Jugador | Valor
   * full   → Valor | Jugador | Extra
   */
  layout?: "simple" | "full";
  labels?: {
    value?: string;
    subject?: string;
    extra?: string;
  };
  renderExtra?: (payload: ActivityRankingPayload) => ReactNode;
}

export default function RankingTable({
  rankings,
  className,
  layout = "full",
  labels = {},
  renderExtra,
}: RankingTableProps) {
  const headerValue = labels.value ?? "Valor";
  const headerSubject = labels.subject ?? "Jugador";
  const headerExtra = labels.extra ?? "Extra";

  return (
    <Card className={className}>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {layout === "full" && (
                <TableHead className="text-center font-semibold">{headerValue}</TableHead>
              )}

              <TableHead className="font-semibold">{headerSubject}</TableHead>

              {layout === "full" && (
                <TableHead className="text-right font-semibold">{headerExtra}</TableHead>
              )}

              {layout === "simple" && (
                <TableHead className="text-right font-semibold">{headerValue}</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.values(rankings)
              .sort((a, b) => a.rank - b.rank)
              .map((ranking) => {
                const user = getUserById(ranking.userId);

                return (
                  <TableRow key={ranking.userId} className="hover:bg-muted/40 rounded-lg">
                    {/* VALOR (solo en layout full) */}
                    {layout === "full" && (
                      <TableCell className="text-center font-semibold">{ranking.points}</TableCell>
                    )}

                    {/* JUGADOR (siempre) */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar userId={ranking.userId} size={8} />
                        <span className="font-medium">
                          {user.name} {user.surname.charAt(0)}.
                        </span>
                      </div>
                    </TableCell>

                    {/* EXTRA (solo en layout full) */}
                    {layout === "full" && (
                      <TableCell className="text-right text-muted-foreground">
                        {renderExtra
                          ? renderExtra(ranking.payload)
                          : typeof ranking.payload === "object"
                            ? JSON.stringify(ranking.payload)
                            : ranking.payload}
                      </TableCell>
                    )}

                    {/* VALOR (layout simple, a la derecha) */}
                    {layout === "simple" && (
                      <TableCell className="text-right font-semibold text-lg">
                        {ranking.points}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
