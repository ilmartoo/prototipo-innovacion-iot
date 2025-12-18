import type { ReactNode } from "react";

interface SectionTitleProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export default function SectionTitle(props: SectionTitleProps) {
  return (
    <div>
      <h2 className="text-lg font-bold mt-4">{props.title}</h2>
      {props.subtitle && <p className="text-sm text-muted-foreground mt-1">{props.subtitle}</p>}
    </div>
  );
}
