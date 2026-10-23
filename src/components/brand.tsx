import { Link } from "@tanstack/react-router";
import { Check, Clock, AlertTriangle, CircleSlash, Hourglass, ShieldCheck, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: "/" | "/app" }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2.5 rounded-lg", className)}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-primary text-[15px] font-extrabold text-primary-foreground shadow-glow">
        д.
      </span>
      <span className="text-[17px] font-bold tracking-tight text-foreground">Договорено</span>
    </Link>
  );
}

export type Status = "tracking" | "waiting" | "soon" | "overdue" | "done" | "untracked" | "cancelled";

export const statusMeta: Record<Status, { label: string; cls: string; icon: typeof Check }> = {
  tracking: { label: "Под контролем", cls: "bg-success-soft text-success", icon: ShieldCheck },
  waiting: { label: "Ждёт ответа", cls: "bg-primary-soft text-primary-deep", icon: Hourglass },
  soon: { label: "Срок приближается", cls: "bg-warning-soft text-warning", icon: Clock },
  overdue: { label: "Просрочено", cls: "bg-destructive-soft text-destructive", icon: AlertTriangle },
  done: { label: "Выполнено", cls: "bg-success-soft text-success", icon: Check },
  untracked: { label: "Не отслеживается", cls: "bg-neutral-soft text-muted-foreground", icon: CircleSlash },
  cancelled: { label: "Отменено", cls: "bg-neutral-soft text-muted-foreground", icon: Ban },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const m = statusMeta[status];
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        m.cls,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {m.label}
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
