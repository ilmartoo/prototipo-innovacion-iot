import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { secondsToTimeString } from "@/data/app-data";
import type { RefereeEntry } from "@/data/models/real-time";
import type { User } from "@/data/models/user";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

interface RefereeLogProps {
  entries: RefereeEntry[];
  participants: Record<string, User>;
}

export default function RefereeLog(props: RefereeLogProps) {
  function playerName(player: string): string {
    return props.participants[player].name;
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entrada</TableHead>
              <TableHead className="text-right">Tiempo</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <ScrollArea className="h-130">
          <Table>
            <TableBody>
              {props.entries.map((e, i) => {
                let className: string;
                let message: string;

                switch (e.type) {
                  case "turn":
                    className = "text-blue-400";
                    message = e.data.from
                      ? `El turno pasa a ${playerName(e.data.to)}`
                      : `${playerName(e.data.to)} tiene el primer turno`;
                    break;
                  case "game-position":
                    className = "text-blue-400";
                    message = e.data.from
                      ? `${playerName(e.data.player)} pasa de ${e.data.from} a ${e.data.to}`
                      : `${playerName(e.data.player)} empieza en ${e.data.to}`;
                    break;
                  case "win":
                    className = "text-amber-500";
                    message = `${playerName(e.data.player)} ha ganado`;
                    break;
                  case "shot":
                    switch (e.data.type) {
                      case "in":
                        className = "text-green-500";
                        message = `${playerName(e.data.player)} ha anotado un punto`;
                        break;
                      case "goalkeeper":
                        className = "text-orange-500";
                        message = `${playerName(e.data.player)} ha fallado el lanzamiento (portero)`;
                        break;
                      case "out":
                        className = "text-red-500";
                        message = `${playerName(e.data.player)} ha fallado el lanzamiento (fuera)`;
                        break;
                    }
                    break;
                  case "foul":
                    switch (e.data.type) {
                      case "timeout":
                        className = "text-red-500";
                        message = `${playerName(e.data.player)} ha sobrepasado el tiempo máximo de turno`;
                        break;
                      case "area":
                        className = "text-red-500";
                        message = `Lanzamiento anulado a ${playerName(e.data.player)} por pisar el área durante el lanzamiento`;
                        break;
                      case "shot-without-turn":
                        className = "text-red-500";
                        message = `${playerName(e.data.player)} ha realizado un lanzamiento fuera de turno`;
                        break;
                    }
                    break;
                }

                return (
                  <TableRow key={i}>
                    <TableCell className={cn("whitespace-normal wrap-break-word", className)}>
                      {message}
                    </TableCell>
                    <TableCell className="text-right">{secondsToTimeString(e.timestamp)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
