import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import type { ReactNode } from "react";

interface TopBarProps {
  title: string;
  description?: string;
  backTo?: string;
  children?: ReactNode;
}

export default function TopBar({ title, description, backTo = "/", children }: TopBarProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link to={backTo}>
            <Button variant="ghost" size="sm" className="border-0 shadow-none p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {children && (
          <div className="flex items-center gap-4">
            {children}
          </div>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground mt-2">
          {description}
        </p>
      )}
    </div>
  );
}