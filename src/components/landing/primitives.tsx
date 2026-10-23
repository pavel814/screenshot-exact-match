import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  center,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-3xl", center && "mx-auto text-center")}>
      {eyebrow && <p className="mb-4 text-sm font-semibold text-primary">{eyebrow}</p>}
      <h2 className="display text-[36px] sm:text-[48px] lg:text-[56px]">{title}</h2>
      {sub && <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}

export function Bubble({
  side,
  children,
  time,
  className,
}: {
  side: "in" | "out";
  children: React.ReactNode;
  time?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex", side === "out" ? "justify-end" : "justify-start", className)}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug shadow-soft",
          side === "out"
            ? "rounded-br-md bg-chat-out text-foreground"
            : "rounded-bl-md border border-border bg-chat-in text-foreground",
        )}
      >
        {children}
        {time && (
          <span className="ml-2 align-bottom font-mono text-[10px] text-muted-foreground">{time}</span>
        )}
      </div>
    </div>
  );
}

export function WindowChrome({
  title,
  children,
  className,
  right,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-float", className)}>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="min-w-0 flex-1 truncate text-[13px] font-semibold text-foreground">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}
