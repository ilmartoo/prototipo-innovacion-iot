import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string | number;
  label: string;
  subtitle?: string;
  progress?: number; // 0-100 para mostrar barra de progreso
  progressColor?: "default" | "blue" | "green" | "red" | "yellow";
  className?: string;
}

const progressColorClasses = {
  default: "",
  blue: "[&>div]:bg-blue-500",
  green: "[&>div]:bg-green-500",
  red: "[&>div]:bg-red-500",
  yellow: "[&>div]:bg-yellow-500",
};

export default function StatCard({
  value,
  label,
  subtitle,
  progress,
  progressColor = "default",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-4 bg-gray-50 border-0 shadow-sm", className)}>
      <CardContent className="flex flex-col p-0 gap-2 h-full">
        <div className="text-2xl font-bold text-gray-900">{value}</div>

        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>

        {progress !== undefined && (
          <Progress
            value={progress}
            className={cn("mt-auto h-2 bg-gray-200", progressColorClasses[progressColor])}
          />
        )}
      </CardContent>
    </Card>
  );
}
