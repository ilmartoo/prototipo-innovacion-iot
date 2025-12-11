import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { getActivityTime, type Activity } from "@/models/activity";
import { Clipboard, Clock4, Users } from "lucide-react";

interface ActivitySummaryProps {
  activity: Activity;
  userPicture: string;
  onIconClick: () => void;
}

export default function ActivitySummary(props: ActivitySummaryProps) {
  return (
    <Card className="flex">
      <div>
        <CardContent className="grid grid-cols-[auto_1fr]">
          <CardTitle>{props.activity.title}</CardTitle>
          <div>
            <Clock4 /> {getActivityTime(props.activity.date)}
          </div>
          <div>
            <Avatar>
              <AvatarImage src={props.userPicture} alt="Activity owner picture" />
            </Avatar>
          </div>
          <div className="text-muted-foreground">
            <Users />
            {props.activity.participants}/{props.activity.maxParticipants}
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription>{props.activity.description}</CardDescription>
        </CardFooter>
      </div>
      <div>
        <Button variant="ghost" onClick={props.onIconClick}>
          <Clipboard />
        </Button>
      </div>
    </Card>
  );
}
