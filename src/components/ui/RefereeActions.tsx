import { Item, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { RefereeEntry } from "@/data/models/real-time";
import type { User } from "@/data/models/user";
import {
  BadgeCheckIcon,
  BadgeXIcon,
  CircleAlertIcon,
  FastForwardIcon,
  MapPinnedIcon,
  TrophyIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import UserAvatar from "./UserAvatar";

interface RefereeActionsProps {
  entries: RefereeEntry[];
  participants: Record<string, User>;
}

export default function RefereeActions(props: RefereeActionsProps) {
  function userAvatarWithName(player: string): ReactNode {
    return (
      <>
        <div className="inline-block align-middle pl-0.5 pr-1 pb-0.5">
          <UserAvatar userId={player} size={6} />
        </div>
        <span>{props.participants[player].name}</span>
      </>
    );
  }

  function refereeItem(entry: RefereeEntry, key: number): ReactNode {
    const generateItem = (icon: ReactNode, text: ReactNode) => (
      <Item
        key={key}
        variant="outline"
        className="shadow-sm grid grid-cols-[auto_1fr] items-center gap-2"
      >
        <ItemMedia>{icon}</ItemMedia>
        <ItemTitle className="block w-full fill-1 gap-1 leading-relaxed">{text}</ItemTitle>
      </Item>
    );

    switch (entry.type) {
      case "turn":
        return generateItem(
          <FastForwardIcon className="stroke-blue-400" strokeWidth={1.5} />,
          <>
            {entry.data.from ? (
              <>El turno pasa a {userAvatarWithName(entry.data.to)}</>
            ) : (
              <>{userAvatarWithName(entry.data.to)} tiene el primer turno</>
            )}
          </>
        );
      case "game-position":
        return generateItem(
          <MapPinnedIcon className="stroke-blue-400" strokeWidth={1.5} />,
          <>
            {entry.data.from ? (
              <>
                {userAvatarWithName(entry.data.player)} pasa de {entry.data.from} a {entry.data.to}
              </>
            ) : (
              <>
                {userAvatarWithName(entry.data.player)} empieza en {entry.data.to}
              </>
            )}
          </>
        );
      case "win":
        return generateItem(
          <TrophyIcon className="stroke-amber-500" strokeWidth={1.5} />,
          <>Ha ganado {userAvatarWithName(entry.data.player)}</>
        );
      case "shot":
        switch (entry.data.type) {
          case "in":
            return generateItem(
              <BadgeCheckIcon className="stroke-green-500" strokeWidth={1.5} />,
              <>{userAvatarWithName(entry.data.player)} ha anotado un punto</>
            );
          case "goalkeeper":
            return generateItem(
              <BadgeXIcon className="stroke-orange-500" strokeWidth={1.5} />,
              <>{userAvatarWithName(entry.data.player)} ha fallado el lanzamiento (portero)</>
            );
          case "out":
            return generateItem(
              <BadgeXIcon className="stroke-red-500" strokeWidth={1.5} />,
              <>{userAvatarWithName(entry.data.player)} ha fallado el lanzamiento (fuera)</>
            );
        }
      case "foul":
        switch (entry.data.type) {
          case "timeout":
            return generateItem(
              <CircleAlertIcon className="stroke-red-500" strokeWidth={1.5} />,
              <>{userAvatarWithName(entry.data.player)} ha sobrepasado el tiempo máximo de turno</>
            );
          case "area":
            return generateItem(
              <CircleAlertIcon className="stroke-red-500" strokeWidth={1.5} />,
              <>
                Lanzamiento anulado a {userAvatarWithName(entry.data.player)} por pisar el área
                durante el lanzamiento
              </>
            );
          case "shot-without-turn":
            return generateItem(
              <CircleAlertIcon className="stroke-red-500" strokeWidth={1.5} />,
              <>
                {userAvatarWithName(entry.data.player)} ha realizado un lanzamiento fuera de turno
              </>
            );
        }
    }
  }

  return props.entries.map((e, i) => refereeItem(e, i));
}
