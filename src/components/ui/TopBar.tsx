import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

interface TopBarProps {
  title: string;
  description?: string;
  to: string;
  children?: ReactNode;
  titleClassName?: string;
}

export default function TopBar(props: TopBarProps) {
  return (
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to={props.to}>
            <ChevronLeftIcon className="size-6" />
          </Link>
        </Button>
        <h1 className="text-lg font-bold tracking-tight">{props.title}</h1>
        {props.children && <div className="ml-auto">{props.children}</div>}
      </div>
      {props.description && <p className="text-muted-foreground">{props.description}</p>}
    </div>
  );
}
