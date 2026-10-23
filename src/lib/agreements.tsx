import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Status } from "@/components/brand";

export type Kind = "mine" | "theirs" | "waiting" | "incoming";
export const kindLabel: Record<Kind, string> = {
  mine: "Я обещал",
  theirs: "Мне обещали",
  waiting: "Жду ответа",
  incoming: "Входящая просьба",
};

export type HistoryEvent = { at: string; text: string; type: "found" | "moved" | "check" | "done" | "edit" | "untracked" };

export type Agreement = {
  id: string;
  kind: Kind;
  title: string;
  person: string | null;
  said: string; // phrase as said
  saidAt: string; // ISO
  quote: string | null;
  due: string | null; // ISO
  nextCheck: string | null; // ISO
  status: Status;
  manual?: boolean;
  draft: string;
  history: HistoryEvent[];
};

const d = (days: number, h = 9, m = 0) => {
  const x = new Date();
  x.setDate(x.getDate() + days);
  x.setHours(h, m, 0, 0);
  return x.toISOString();
};

const seed: Agreement[] = [
  {
    id: "a1",
    kind: "theirs",
    title: "Настроить конфигурацию для ключа",
    person: "Дмитрий",
    said: "сделаю как будет минутка",
    saidAt: d(-1, 14, 20),
    quote: "Ок, настрою конфиг для ключа, как будет минутка",
    due: null,
    nextCheck: d(3, 9),
    status: "waiting",
    draft: "Привет! Получилось глянуть конфигурацию для ключа?",
    history: [
      { at: d(-1, 14, 21), text: "Обещание обнаружено", type: "found" },
      { at: d(-1, 14, 22), text: "Следующая проверка назначена", type: "check" },
    ],
  },
  {
    id: "a2",
    kind: "mine",
    title: "Заменить аккумулятор",
    person: "Папа",
    said: "сегодня",
    saidAt: d(0, 8, 40),
    quote: "Да, сегодня заменю аккумулятор, не переживай",
    due: d(0, 20),
    nextCheck: d(0, 17),
    status: "soon",
    draft: "Аккумулятор заменил, всё работает 👍",
    history: [{ at: d(0, 8, 41), text: "Обещание обнаружено", type: "found" }],
  },
  {
    id: "a3",
    kind: "mine",
    title: "Участвовать во встрече в 15:00",
    person: "Катя",
    said: "завтра встреча в 15",
    saidAt: d(-1, 18, 2),
    quote: "Буду завтра на встрече в 15",
    due: d(1, 15),
    nextCheck: d(1, 11),
    status: "tracking",
    manual: true,
    draft: "Катя, подтверждаю — буду в 15:00.",
    history: [
      { at: d(-1, 18, 3), text: "Обещание обнаружено", type: "found" },
      { at: d(-1, 19, 0), text: "Время уточнено вручную", type: "edit" },
    ],
  },
  {
    id: "a4",
    kind: "mine",
    title: "Отправить документы Андрею",
    person: "Андрей",
    said: "в пятницу, до обеда",
    saidAt: d(-4, 11, 4),
    quote: "Не успею, отправлю в понедельник",
    due: d(-1, 13),
    nextCheck: null,
    status: "overdue",
    draft: "Андрей, прости за задержку — отправлю сегодня до вечера.",
    history: [
      { at: d(-4, 11, 5), text: "Обещание обнаружено", type: "found" },
      { at: d(-2, 19, 40), text: "Срок перенесён: пятница → понедельник", type: "moved" },
    ],
  },
  {
    id: "a5",
    kind: "waiting",
    title: "Ответ по поводу аренды дачи",
    person: "Ирина",
    said: "уточню у мужа и напишу",
    saidAt: d(-2, 12),
    quote: "Уточню у мужа и напишу тебе",
    due: null,
    nextCheck: d(1, 10),
    status: "waiting",
    draft: "Ирина, привет! Удалось обсудить дачу?",
    history: [{ at: d(-2, 12, 1), text: "Ожидание ответа обнаружено", type: "found" }],
  },
  {
    id: "a6",
    kind: "incoming",
    title: "Посоветовать стоматолога",
    person: "Лена",
    said: "посоветуй, пожалуйста, хорошего стоматолога",
    saidAt: d(-1, 9, 30),
    quote: "Посоветуй, пожалуйста, хорошего стоматолога 🙏",
    due: null,
    nextCheck: d(2, 9),
    status: "tracking",
    draft: "Лена, я хожу к доктору в клинике на Притыцкого — очень рекомендую.",
    history: [{ at: d(-1, 9, 31), text: "Просьба обнаружена", type: "found" }],
  },
  {
    id: "a7",
    kind: "mine",
    title: "Посмотреть договор аренды для Ольги",
    person: "Ольга",
    said: "во вторник вечером",
    saidAt: d(-6, 9, 20),
    quote: "Посмотрел, оставил комментарии в файле",
    due: d(-3, 20),
    nextCheck: null,
    status: "done",
    draft: "",
    history: [
      { at: d(-6, 9, 21), text: "Обещание обнаружено", type: "found" },
      { at: d(-5, 17, 5), text: "Срок перенесён: вторник → четверг", type: "moved" },
      { at: d(-3, 20, 31), text: "Выполнено — подтверждено в переписке", type: "done" },
    ],
  },
];

type Ctx = {
  items: Agreement[];
  markDone: (id: string) => void;
  postpone: (id: string, due: string) => void;
  edit: (id: string, patch: Pick<Agreement, "title" | "due" | "kind">) => void;
  untrack: (id: string) => void;
  restore: (id: string) => void;
};

const AgreementsCtx = createContext<Ctx | null>(null);

export function AgreementsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Agreement[]>(seed);

  const update = useCallback((id: string, fn: (a: Agreement) => Agreement) => {
    setItems((prev) => prev.map((a) => (a.id === id ? fn(a) : a)));
  }, []);
  const now = () => new Date().toISOString();

  const value = useMemo<Ctx>(
    () => ({
      items,
      markDone: (id) =>
        update(id, (a) => ({ ...a, status: "done", nextCheck: null, history: [...a.history, { at: now(), text: "Отмечено как выполненное", type: "done" }] })),
      postpone: (id, due) =>
        update(id, (a) => ({
          ...a,
          due,
          status: "tracking",
          nextCheck: due,
          history: [...a.history, { at: now(), text: `Срок перенесён на ${fmtDateTime(due)}`, type: "moved" }],
        })),
      edit: (id, patch) =>
        update(id, (a) => ({ ...a, ...patch, manual: true, history: [...a.history, { at: now(), text: "Данные исправлены вручную", type: "edit" }] })),
      untrack: (id) =>
        update(id, (a) => ({ ...a, status: "untracked", nextCheck: null, history: [...a.history, { at: now(), text: "Отслеживание отключено", type: "untracked" }] })),
      restore: (id) =>
        update(id, (a) => ({ ...a, status: "tracking", history: [...a.history, { at: now(), text: "Отслеживание возобновлено", type: "check" }] })),
    }),
    [items, update],
  );
  return <AgreementsCtx.Provider value={value}>{children}</AgreementsCtx.Provider>;
}

export function useAgreements() {
  const c = useContext(AgreementsCtx);
  if (!c) throw new Error("useAgreements outside provider");
  return c;
}

export const isOpen = (a: Agreement) => a.status !== "done" && a.status !== "untracked" && a.status !== "cancelled";

const fmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });
const fmtT = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });
export function fmtDateTime(iso: string) {
  const x = new Date(iso);
  const t = new Date();
  const diff = Math.round((new Date(x.toDateString()).getTime() - new Date(t.toDateString()).getTime()) / 86400000);
  const day = diff === 0 ? "сегодня" : diff === 1 ? "завтра" : diff === -1 ? "вчера" : fmt.format(x);
  return `${day}, ${fmtT.format(x)}`;
}
export function fmtDate(iso: string) {
  return fmt.format(new Date(iso));
}
