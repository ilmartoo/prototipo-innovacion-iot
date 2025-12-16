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
import type { ActivityRanking } from "@/data/models/activity-ranking";

interface RankingTableProps {
  rankings: Record<string, ActivityRanking<string>>;
  showRank?: boolean;
  className?: string;
}

export default function RankingTable({
  rankings,
  showRank = false,
  className,
}: RankingTableProps) {
  return (
    <Card className={className}>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {showRank && <TableHead className="text-center font-semibold">Rango</TableHead>}
              <TableHead className="text-center font-semibold">Goles</TableHead>
              <TableHead className="font-semibold">Jugador</TableHead>
              <TableHead className="text-right font-semibold">Posición</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(rankings)
              .sort((a, b) => a.rank - b.rank)
              .map((ranking) => (
                <TableRow key={ranking.id}>
                  {showRank && (
                    <TableCell className="text-center font-semibold">
                      #{ranking.rank}
                    </TableCell>
                  )}
                  <TableCell className="text-center font-semibold text-lg">
                    {ranking.points}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar userId={ranking.userId} size={8} />
                      <span className="font-medium">
                        {getUserById(ranking.userId).name}{" "}
                        {getUserById(ranking.userId).surname.charAt(0)}.
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {ranking.payload}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}