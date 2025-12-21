import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import UserAvatar from "@/components/ui/UserAvatar";
import { activityParticipants, currentUser, getUserById, isUserInActivity } from "@/data/app-data";
import { getActivityTime, type Activity } from "@/data/models/activity";
import {
  ClipboardCheckIcon,
  ClipboardPasteIcon,
  ClipboardPenIcon,
  Clock4Icon,
  ClockAlertIcon,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

interface ActivitySummaryProps {
  activity: Activity;
  isListing?: boolean;
  onIconClick?: () => void;
}

export default function ActivitySummary(props: ActivitySummaryProps) {
  const owner = getUserById(props.activity.ownerId);

  function icon() {
    let variant: "default" | "outline";
    let icon: ReactNode;

    if (props.isListing) {
      if (isUserInActivity(currentUser.id, props.activity.id)) {
        variant = "outline";
        icon = <ClipboardCheckIcon className="size-5" strokeWidth={1.5} />;
      } else {
        variant = "default";
        icon = <ClipboardPenIcon className="size-5" strokeWidth={1.5} />;
      }
    } else {
      variant = "default";
      icon = <ClipboardPasteIcon className="size-5" strokeWidth={1.5} />;
    }

    return (
      <Button
        size="icon"
        variant={variant}
        className="rounded-full cursor-pointer"
        onClick={props.onIconClick}
      >
        {icon}
      </Button>
    );
  }

  return (
    <Item className="flex p-0">
      <ItemContent>
        <ActivityDataRow>
          <ItemTitle className="line-clamp-1 text-base">{props.activity.title}</ItemTitle>
          <div className="flex items-center gap-0.5">
            {props.activity.started && !props.activity.finished ? (
              <>
                <ClockAlertIcon strokeWidth={1.5} className="size-5" />{" "}
                <span className="font-semibold">En directo</span>
              </>
            ) : (
              <>
                <Clock4Icon strokeWidth={1.5} className="size-5" />{" "}
                <span>{getActivityTime(props.activity.date)}</span>
              </>
            )}
          </div>
        </ActivityDataRow>
        <ActivityDataRow>
          <div className="flex items-center gap-2">
            <UserAvatar userId={owner.id} size={6} />
            <span className="line-clamp-1">
              {owner.name} {owner.surname}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-0.5">
            <Users strokeWidth={1.5} className="size-5" />
            {activityParticipants[props.activity.id].length}/{props.activity.maxParticipants}
          </div>
        </ActivityDataRow>
        <ItemDescription>{props.activity.description}</ItemDescription>
      </ItemContent>

      <ItemActions>{icon()}</ItemActions>
    </Item>
  );
}

interface ActivityDataRowProps {
  children: ReactNode;
}

function ActivityDataRow(props: ActivityDataRowProps) {
  return <div className="flex justify-between">{props.children}</div>;
}
