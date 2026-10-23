import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Check, CalendarClock, Sparkles, PenLine, MessageSquareQuote, Clock, EyeOff } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/brand";
import { Bubble } from "@/components/landing/primitives";
import { fmtDateTime, isOpen, kindLabel, useAgreements, type Agreement, type Kind } from "@/lib/agreements";
import { cn } from "@/lib/utils";

export type DialogKind = "draft" | "later" | "edit" | "untrack" | null;

const toLocal = (iso: string) => {
  const x = new Date(iso);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 16);
};

export function DetailDrawer({ a, onClose, onAction }: { a: Agreement | null; onClose: () => void; onAction: (k: Exclude<DialogKind, null> | "done") => void }) {
  return (
    <Sheet open={!!a} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-[460px]">
        {a && (
          <div className="flex min-h-full flex-col">
            <div className="border-b border-border p-6 pr-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow">{kindLabel[a.kind]}</span>
                <StatusBadge status={a.status} />
              </div>
              <SheetTitle className="mt-3 text-[22px] font-bold leading-snug tracking-tight">{a.title}</SheetTitle>
              <SheetDescription className="mt-1">{a.person ? `Собеседник: ${a.person}` : "Собеседник не определён"}</SheetDescription>
            </div>

            <div className="space-y-7 p-6">
              <section>
                <h4 className="eyebrow mb-3 flex items-center gap-1.5"><MessageSquareQuote className="h-3.5 w-3.5" /> Исходное сообщение</h4>
                {a.quote ? (
                  <div className="rounded-2xl bg-background-warm p-4">
                    <Bubble side={a.kind === "mine" || a.kind === "waiting" ? "out" : "in"} time={fmtDateTime(a.saidAt)}>{a.quote}</Bubble>
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">Исходное сообщение недоступно.</p>
                )}
              </section>

              <section className="grid grid-cols-2 gap-2">
                {[
                  ["Сказано", `«${a.said}»`],
                  ["Когда", fmtDateTime(a.saidAt)],
                  ["Срок", a.due ? fmtDateTime(a.due) : "Не указан"],
                  ["Проверка", a.nextCheck ? fmtDateTime(a.nextCheck) : "Не назначена"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-background p-3">
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="mt-0.5 text-sm font-semibold">{v}</p>
                  </div>
                ))}
              </section>

              <section>
                <h4 className="eyebrow mb-3">История изменений</h4>
                {a.history.length ? (
                  <ol className="relative space-y-4 border-l border-border pl-5">
                    {a.history.map((h, i) => (
                      <li key={i} className="relative">
                        <span className={cn("absolute -left-[26px] top-1 h-3 w-3 rounded-full ring-4 ring-card",
                          h.type === "done" ? "bg-success" : h.type === "moved" ? "bg-warning" : h.type === "untracked" ? "bg-muted-foreground" : "bg-primary")} />
                        <p className="text-sm font-semibold">{h.text}</p>
                        <p className="font-mono text-xs text-muted-foreground">{fmtDateTime(h.at)}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-muted-foreground">Событий пока нет.</p>
                )}
              </section>
            </div>

            <div className="sticky bottom-0 mt-auto flex flex-wrap gap-2 border-t border-border bg-card p-4">
              {isOpen(a) && <Button variant="success" onClick={() => onAction("done")}><Check /> Готово</Button>}
              {isOpen(a) && <Button variant="outline" onClick={() => onAction("later")}><Clock /> Позже</Button>}
              <Button variant="ghost" onClick={() => onAction("draft")}>Черновик</Button>
              <Button variant="ghost" onClick={() => onAction("edit")}><PenLine /> Исправить</Button>
              {isOpen(a) && <Button variant="ghost" className="text-destructive" onClick={() => onAction("untrack")}><EyeOff /> Не следить</Button>}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function ActionDialogs({ a, kind, onClose }: { a: Agreement | null; kind: DialogKind; onClose: () => void }) {
  const { postpone, edit, untrack } = useAgreements();
  const [draft, setDraft] = useState("");
  const [due, setDue] = useState("");
  const [title, setTitle] = useState("");
  const [k, setK] = useState<Kind>("mine");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!a) return;
    setDraft(a.draft);
    setTitle(a.title);
    setK(a.kind);
    setDue(a.due ? toLocal(a.due) : "");
    setCopied(false);
    setErr("");
  }, [a, kind]);

  const quick = (days: number, h: number) => {
    const x = new Date();
    x.setDate(x.getDate() + days);
    x.setHours(h, 0, 0, 0);
    setDue(toLocal(x.toISOString()));
  };

  return (
    <>
      <Dialog open={kind === "draft"} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Черновик ответа</DialogTitle>
            <DialogDescription>Отредактируй текст и скопируй — сервис ничего не отправляет сам.</DialogDescription>
          </DialogHeader>
          <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} className="rounded-xl text-[15px]" placeholder="Текст ответа" />
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Закрыть</Button>
            <Button
              disabled={!draft.trim()}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(draft);
                  setCopied(true);
                  toast.success("Скопировано в буфер обмена");
                } catch {
                  toast.error("Не удалось скопировать. Выдели текст и скопируй вручную.");
                }
              }}
            >
              {copied ? <Check /> : <Copy />} {copied ? "Скопировано" : "Скопировать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={kind === "later"} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> Перенести срок</DialogTitle>
            <DialogDescription>{a?.title}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {[["Через 3 часа", -1, 0], ["Завтра утром", 1, 9], ["Через неделю", 7, 9]].map(([l, d, h]) => (
              <Button key={l as string} variant="outline" size="sm" onClick={() => {
                if (d === -1) { const x = new Date(Date.now() + 3 * 3600e3); setDue(toLocal(x.toISOString())); } else quick(d as number, h as number);
              }}>{l}</Button>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="due">Новая дата и время</Label>
            <Input id="due" type="datetime-local" value={due} onChange={(e) => { setDue(e.target.value); setErr(""); }} className="h-11 rounded-xl" aria-invalid={!!err} />
            {err && <p className="text-sm text-destructive">{err}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Отмена</Button>
            <Button onClick={() => {
              if (!a) return;
              if (!due) return setErr("Выбери дату и время");
              const iso = new Date(due).toISOString();
              if (new Date(iso).getTime() < Date.now()) return setErr("Дата должна быть в будущем");
              postpone(a.id, iso);
              toast.success(`Срок перенесён на ${fmtDateTime(iso)}`);
              onClose();
            }}>Перенести</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={kind === "edit"} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Исправить договорённость</DialogTitle>
            <DialogDescription>Если сервис понял что-то не так — поправь вручную.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="t">Что нужно сделать</Label>
              <Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Тип</Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(kindLabel) as Kind[]).map((x) => (
                  <button key={x} type="button" onClick={() => setK(x)} className={cn("rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors", k === x ? "border-primary bg-primary-soft text-primary-deep" : "border-border hover:bg-secondary")}>
                    {kindLabel[x]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d2">Срок</Label>
              <Input id="d2" type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} className="h-11 rounded-xl" />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Отмена</Button>
            <Button onClick={() => {
              if (!a) return;
              if (title.trim().length < 3) return setErr("Опиши договорённость хотя бы в трёх символах");
              edit(a.id, { title: title.trim(), kind: k, due: due ? new Date(due).toISOString() : null });
              toast.success("Изменения сохранены");
              onClose();
            }}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={kind === "untrack"} onOpenChange={(o) => !o && onClose()}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Перестать следить?</AlertDialogTitle>
            <AlertDialogDescription>
              «{a?.title}» больше не будет напоминать о себе. Запись останется в истории, и её можно вернуть под контроль.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[10px]">Отмена</AlertDialogCancel>
            <AlertDialogAction className="rounded-[10px] bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
              if (!a) return;
              untrack(a.id);
              toast("Отслеживание отключено", { description: a.title });
              onClose();
            }}>Не следить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
