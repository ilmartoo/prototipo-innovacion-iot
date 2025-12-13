import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { getActivityTime, type Activity } from "@/models/activity";
import { Clipboard, Clock4, Users } from "lucide-react";

interface ActivitySummaryProps {
  activity: Activity;
  userPicture: string;
  onIconClick?: () => void;
}

export default function ActivitySummary(props: ActivitySummaryProps) {
  return (
    <Item className="flex">
      <ItemContent>
        <CardContent className="grid grid-cols-[auto_1fr]">
          <ItemTitle>{props.activity.title}</ItemTitle>
          <div>
            <Clock4 strokeWidth="1" /> {getActivityTime(props.activity.date)}
          </div>
          <div>
            <Avatar>
              <AvatarImage src={props.userPicture} alt="Activity owner picture" />
            </Avatar>
          </div>
          <div className="text-muted-foreground">
            <Users strokeWidth="1" />
            {props.activity.participants}/{props.activity.maxParticipants}
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription>{props.activity.description}</CardDescription>
        </CardFooter>
        <div>
          <Button variant="ghost" onClick={props.onIconClick}>
            <Clipboard />
          </Button>
        </div>
      </ItemContent>
    </Item>
  );
}
