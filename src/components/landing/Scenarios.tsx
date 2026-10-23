import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bubble, WindowChrome } from "./primitives";
import { StatusBadge, type Status } from "@/components/brand";
import { cn } from "@/lib/utils";

type Scenario = {
  id: string;
  label: string;
  person: string;
  msgs: { side: "in" | "out"; text: string; time: string; mark?: boolean }[];
  card: { kind: string; title: string; status: Status; rows: [string, string][]; note: string };
};

const scenarios: Scenario[] = [
  {
    id: "promise",
    label: "Обещание",
    person: "Ольга",
    msgs: [
      { side: "in", text: "Посмотришь договор аренды до среды?", time: "09:12" },
      { side: "out", text: "Да, гляну во вторник вечером", time: "09:20", mark: true },
    ],
    card: {
      kind: "Я обещал",
      title: "Посмотреть договор аренды для Ольги",
      status: "tracking",
      rows: [["Срок", "Вторник, вечер"], ["Проверка", "Вторник, 18:00"]],
      note: "Новая договорённость",
    },
  },
  {
    id: "move",
    label: "Перенос",
    person: "Ольга",
    msgs: [
      { side: "out", text: "Да, гляну во вторник вечером", time: "пн 09:20" },
      { side: "out", text: "Ольга, давай в четверг? Завал на работе", time: "вт 17:05", mark: true },
      { side: "in", text: "Конечно, без проблем", time: "вт 17:12" },
    ],
    card: {
      kind: "Я обещал",
      title: "Посмотреть договор аренды для Ольги",
      status: "soon",
      rows: [["Было", "Вторник"], ["Стало", "Четверг"]],
      note: "Срок перенесён по согласию",
    },
  },
  {
    id: "done",
    label: "Выполнено",
    person: "Ольга",
    msgs: [
      { side: "out", text: "Посмотрел, оставил комментарии в файле 👌", time: "чт 20:31", mark: true },
      { side: "in", text: "Спасибо огромное!", time: "чт 20:40" },
    ],
    card: {
      kind: "Я обещал",
      title: "Посмотреть договор аренды для Ольги",
      status: "done",
      rows: [["Выполнено", "Четверг, 20:31"], ["Перенос", "1 раз"]],
      note: "Результат подтверждён в переписке",
    },
  },
  {
    id: "cancel",
    label: "Отмена",
    person: "Ольга",
    msgs: [
      { side: "in", text: "Слушай, договор уже не нужен — квартиру отдали другим", time: "ср 12:02", mark: true },
      { side: "out", text: "Жаль. Ок, тогда снимаю", time: "ср 12:10" },
    ],
    card: {
      kind: "Я обещал",
      title: "Посмотреть договор аренды для Ольги",
      status: "cancelled",
      rows: [["Причина", "Больше не актуально"], ["Кто отменил", "Ольга"]],
      note: "Слежение остановлено",
    },
  },
];

export function Scenarios() {
  const [active, setActive] = useState(0);
  const s = scenarios[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Сценарии"
        className="no-scrollbar mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 shadow-soft"
      >
        {scenarios.map((sc, i) => (
          <button
            key={sc.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "relative shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              i === active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {i === active && (
              <motion.span
                layoutId="scenario-pill"
                className="absolute inset-0 rounded-lg bg-ink"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative">{sc.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-product mt-10 grid gap-6 rounded-[28px] border border-border p-4 sm:p-8 md:grid-cols-2">
        <WindowChrome title={s.person} className="shadow-card">
          <div className="flex min-h-[280px] flex-col justify-end gap-2.5 bg-background-warm p-4">
            <AnimatePresence mode="popLayout">
              {s.msgs.map((m, i) => (
                <motion.div
                  key={s.id + i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.12 }}
                >
                  <Bubble side={m.side} time={m.time}>
                    <span className={m.mark ? "rounded bg-primary-soft px-0.5 ring-1 ring-primary/20" : ""}>
                      {m.text}
                    </span>
                  </Bubble>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </WindowChrome>

        <div className="flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full rounded-2xl border border-border bg-card p-6 shadow-float"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="eyebrow text-primary">{s.card.kind}</p>
                <StatusBadge status={s.card.status} />
              </div>
              <h3
                className={cn(
                  "mt-3 text-[21px] font-bold tracking-tight",
                  s.card.status === "cancelled" && "text-muted-foreground line-through",
                )}
              >
                {s.card.title}
              </h3>
              <dl className="mt-5 grid grid-cols-2 gap-2">
                {s.card.rows.map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-background p-3">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 text-sm font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">{s.card.note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
