import { motion } from "motion/react";
import { Check, Clock, MoreHorizontal, MessageSquareQuote, PenLine, FileText, EyeOff, CalendarClock, Quote, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/brand";
import { kindLabel, fmtDateTime, isOpen, type Agreement } from "@/lib/agreements";
import { cn } from "@/lib/utils";

export type CardAction = "open" | "source" | "draft" | "done" | "later" | "edit" | "untrack" | "restore";

export function AgreementCard({ a, onAction }: { a: Agreement; onAction: (action: CardAction, a: Agreement) => void }) {
  const open = isOpen(a);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "group rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-200 hover:border-input hover:shadow-card",
        !open && "bg-card/70",
      )}
    >
      <button
        type="button"
        onClick={() => onAction("open", a)}
        className="block w-full rounded-t-2xl p-5 text-left focus-visible:outline-offset-[-2px] sm:p-6"
        aria-label={`Подробнее: ${a.title}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={cn("eyebrow", a.kind === "mine" ? "text-primary" : a.kind === "theirs" ? "text-success" : "")}>
            {kindLabel[a.kind]}
            {a.person && <span className="font-medium normal-case tracking-normal text-muted-foreground"> · {a.person}</span>}
          </span>
          <StatusBadge status={a.status} />
        </div>
        <h3 className={cn("mt-2.5 text-[19px] font-bold leading-snug tracking-tight sm:text-[20px]", !open && "text-muted-foreground")}>
          {a.title}
        </h3>
        {a.quote && (
          <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
            <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{a.quote}</span>
          </p>
        )}
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
          <Meta label="Сказано" value={`«${a.said}»`} />
          <Meta label="Срок" value={a.due ? fmtDateTime(a.due) : "не указан"} warn={a.status === "overdue"} />
          {a.nextCheck && <Meta label="Проверка" value={fmtDateTime(a.nextCheck)} icon />}
          {a.manual && <Meta label="" value="изменено вручную" />}
        </dl>
      </button>

      <div className="flex items-center gap-2 border-t border-border px-4 py-3 sm:px-5">
        {open ? (
          <>
            <Button size="sm" variant="success" onClick={() => onAction("done", a)}>
              <Check /> Готово
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAction("later", a)}>
              <Clock /> Позже
            </Button>
          </>
        ) : a.status === "untracked" ? (
          <Button size="sm" variant="outline" onClick={() => onAction("restore", a)}>
            <RotateCcw /> Вернуть под контроль
          </Button>
        ) : null}
        <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => onAction("source", a)}>
          <MessageSquareQuote /> <span className="hidden sm:inline">Источник</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 text-muted-foreground" aria-label="Другие действия">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem onSelect={() => onAction("draft", a)}><FileText /> Черновик ответа</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAction("edit", a)}><PenLine /> Исправить</DropdownMenuItem>
            {open && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onAction("untrack", a)} className="text-destructive focus:text-destructive"><EyeOff /> Не следить</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.article>
  );
}

function Meta({ label, value, warn, icon }: { label: string; value: string; warn?: boolean; icon?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon && <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />}
      {label && <dt className="text-muted-foreground">{label}</dt>}
      <dd className={cn("font-semibold", warn ? "text-destructive" : "text-foreground", !label && "font-medium text-muted-foreground")}>{value}</dd>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-neutral-soft" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-neutral-soft" />
      </div>
      <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-neutral-soft" />
      <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-neutral-soft" />
    </div>
  );
}
