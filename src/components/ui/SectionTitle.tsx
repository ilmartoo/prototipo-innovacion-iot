import type { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
}

export default function SectionTitle(props: SectionTitleProps) {
  return <h2 className="text-lg font-bold mt-4">{props.children}</h2>;
}
