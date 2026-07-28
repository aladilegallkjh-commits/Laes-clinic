import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** direction of the entrance movement */
  from?: "up" | "down" | "left" | "right" | "scale";
  as?: "div" | "section" | "li" | "article" | "header";
};

const hidden: Record<NonNullable<RevealProps["from"]>, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "-translate-x-8",
  right: "translate-x-8",
  scale: "scale-95",
};

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  as: Tag = "div",
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-0"
          : cn("opacity-0 blur-[2px]", hidden[from]),
        className,
      )}
    >
      {children}
    </Tag>
  );
}
