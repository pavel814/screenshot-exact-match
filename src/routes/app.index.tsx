import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { History, Inbox, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, DemoNotice } from "@/components/app/ui";
import { AgreementCard, CardSkeleton } from "@/components/app/AgreementCard";
import { useAgreementActions } from "@/components/app/useAgreementActions";
import { useAgreements, isOpen, type Kind } from "@/lib/agreements";
import { ACCESS_UNTIL, USAGE } from "@/lib/account";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Договорённости — Договорено" },
      { name: "description", content: "Открытые обещания, просьбы и ожидаемые ответы." },
      { property: "og:title", content: "Договорённости — Договорено" },
      { property: "og:description", content: "Открытые обещания, просьбы и ожидаемые ответы." },
    ],
  }),
  component: AgreementsPage,
});

const filters: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "mine", label: "Я обещал" },
  { id: "theirs", label: "Мне обещали" },
  { id: "waiting", label: "Жду ответа" },
  { id: "incoming", label: "Входящие просьбы" },
];

function AgreementsPage() {
  const { items } = useAgreements();
  const { onAction, ui } = useAgreementActions();
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const open = items.filter(isOpen);
  const shown = open.filter((a) => filter === "all" || a.kind === filter);
  const count = (id: "all" | Kind) => open.filter((a) => id === "all" || a.kind === id).length;
  const daysLeft = Math.max(0, Math.ceil((ACCESS_UNTIL.getTime() - Date.now()) / 86400000));

  return (
    <>
      <PageHeader
        title="Договорённости"
        right={
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-[13px] font-semibold text-success">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" /><span className="relative h-2 w-2 rounded-full bg-success" /></span>
            Автоконтроль включён
          </span>
        }
      />
      <DemoNotice />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Сообщений в периоде">
          <p className="text-[28px] font-bold tracking-tight">{USAGE.used.toLocaleString("ru-RU")} <span className="text-lg font-semibold text-muted-foreground">/ {USAGE.limit.toLocaleString("ru-RU")}</span></p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-soft" role="progressbar" aria-valuenow={USAGE.used} aria-valuemax={USAGE.limit}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${(USAGE.used / USAGE.limit) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-primary/50" />
          </div>
        </Stat>
        <Stat label="Доступ до">
          <p className="text-[22px] font-bold leading-tight tracking-tight">
            {ACCESS_UNTIL.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}, {ACCESS_UNTIL.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Осталось {daysLeft} {plural(daysLeft, ["день", "дня", "дней"])} · пробный период</p>
        </Stat>
        <Stat label="Анализ голоса">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-soft px-2.5 py-1 text-[13px] font-semibold text-muted-foreground">
            <MicOff className="h-3.5 w-3.5" /> Выключен
          </span>
          <p className="mt-3 text-sm text-muted-foreground">Голосовые сообщения не анализируются.</p>
        </Stat>
      </div>

      <div className="mt-10 flex items-center gap-3">
        <div role="tablist" aria-label="Фильтр" className="no-scrollbar -mx-4 flex flex-1 gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn("relative flex h-10 shrink-0 items-center gap-2 rounded-[10px] px-3.5 text-sm font-semibold transition-colors",
                filter === f.id ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {filter === f.id && <motion.span layoutId="flt" className="absolute inset-0 rounded-[10px] border border-border bg-card shadow-soft" transition={{ type: "spring", bounce: 0.15, duration: 0.35 }} />}
              <span className="relative">{f.label}</span>
              <span className={cn("relative rounded-md px-1.5 font-mono text-[11px]", filter === f.id ? "bg-primary-soft text-primary-deep" : "bg-secondary")}>{count(f.id)}</span>
            </button>
          ))}
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link to="/app/history"><History /> <span className="hidden sm:inline">История</span></Link>
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          [0, 1, 2].map((i) => <CardSkeleton key={i} />)
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><Inbox className="h-5 w-5" /></span>
            <p className="mt-4 text-lg font-bold">Здесь пока пусто</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Как только в отслеживаемых чатах появится такая договорённость, она окажется здесь.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((a) => <AgreementCard key={a.id} a={a} onAction={onAction} />)}
          </AnimatePresence>
        )}
      </div>
      {ui}
    </>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-3 text-sm font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function plural(n: number, f: [string, string, string]) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return f[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return f[1];
  return f[2];
}
