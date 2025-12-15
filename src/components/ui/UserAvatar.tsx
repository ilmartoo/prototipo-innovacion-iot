import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/data/app-data";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  userId: string;
  size?: number;
}

export default function UserAvatar(props: UserAvatarProps) {
  const user = getUserById(props.userId);
  const fallbackLetters = [user.name[0], ...user.surname.split(/[ \-]/g).map((s) => s[0])]
    .map((c) => c.toUpperCase())
    .join("");

  return (
    <Avatar className={cn(props.className, props.size ? `size-${props.size}` : "")}>
      <AvatarImage src={user.picture} alt="User profile picture" />
      <AvatarFallback> {fallbackLetters} </AvatarFallback>
    </Avatar>
  );
}
