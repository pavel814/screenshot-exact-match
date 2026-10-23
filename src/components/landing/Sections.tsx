import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Check,
  MessageSquareText,
  Lock,
  MousePointerClick,
  Eye,
  Hand,
  Copy,
  Menu,
  X,
  ArrowUpRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, StatusBadge, type Status } from "@/components/brand";
import { Switch } from "@/components/ui/switch";
import { Reveal, SectionHead, Bubble } from "./primitives";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#features", label: "Возможности" },
  { href: "#how", label: "Как работает" },
  { href: "#privacy", label: "Безопасность" },
  { href: "#pricing", label: "Тарифы" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/app">Войти</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/app">Попробовать бесплатно</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-5">
              {nav.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-lg py-3 text-base font-medium">
                  {n.label}
                </a>
              ))}
              <Button asChild className="mt-2">
                <Link to="/app">Попробовать бесплатно</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/app">Войти</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- Features (bento) ---------- */
export function Features() {
  return (
    <section id="features" className="scroll-mt-20 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead title={<>Всё важное из переписки.<br />В одном месте.</>} />
        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <BentoCard n="01" title="Помнит твои обещания" text="Показывает, что ты пообещал и когда это нужно сделать." className="md:col-span-4">
            <div className="space-y-2">
              {[
                ["Заменить аккумулятор", "Сегодня", "soon"],
                ["Вернуть книгу Лёше", "Суббота", "tracking"],
                ["Позвонить маме", "Вчера", "overdue"],
              ].map(([t, d, s]) => (
                <div key={t} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t}</p>
                    <p className="text-xs text-muted-foreground">{d}</p>
                  </div>
                  <StatusBadge status={s as Status} />
                </div>
              ))}
            </div>
          </BentoCard>
          <BentoCard n="02" title="Следит за обещаниями других" text="Помогает не забыть, чего ты ждёшь от собеседника." className="md:col-span-2">
            <div className="rounded-xl border border-border bg-card p-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-success-soft text-xs font-bold text-success">М</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Марина</p>
                  <p className="truncate text-xs text-muted-foreground">«Пришлю макет к среде»</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Осталось</span>
                <span className="font-mono font-medium">2 дня</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-neutral-soft">
                <div className="h-full w-2/3 rounded-full bg-primary/60" />
              </div>
            </div>
          </BentoCard>
          <BentoCard n="03" title="Замечает изменения" text="Учитывает переносы, отмены и сообщения о выполнении." className="md:col-span-2">
            <ol className="relative space-y-3 border-l border-border pl-4 text-sm">
              {[
                ["Обещание обнаружено", "пн"],
                ["Срок перенесён на чт", "вт"],
                ["Выполнено", "чт"],
              ].map(([t, d], i) => (
                <li key={t} className="relative">
                  <span className={cn("absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background", i === 2 ? "bg-success" : i === 1 ? "bg-warning" : "bg-primary")} />
                  <span className="font-semibold">{t}</span> <span className="font-mono text-xs text-muted-foreground">{d}</span>
                </li>
              ))}
            </ol>
          </BentoCard>
          <BentoCard n="04" title="Помогает ответить" text="Показывает исходное сообщение и помогает подготовить ответ или уточнение." className="md:col-span-2">
            <div className="space-y-2">
              <Bubble side="in">Ну что, получится к пятнице?</Bubble>
              <div className="rounded-xl border border-dashed border-primary/40 bg-primary-soft/60 p-3 text-sm">
                <p className="text-xs font-semibold text-primary-deep">Черновик ответа</p>
                <p className="mt-1">Привет! Да, всё в силе — пришлю в пятницу до обеда.</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"><Copy className="h-3 w-3" /> Скопировать</span>
              </div>
            </div>
          </BentoCard>
          <BentoCard n="05" title="Оставляет контроль тебе" text="Ты выбираешь чаты, подтверждаешь действия и решаешь, за чем следить." className="md:col-span-2">
            <ToggleList />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function ToggleList() {
  const [s, set] = useState([true, true, false]);
  const names = ["Андрей", "Мама", "Рабочий чат"];
  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {names.map((n, i) => (
        <label key={n} className="flex cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm font-medium">
          {n}
          <Switch checked={s[i] ?? false} onCheckedChange={(v) => set((p) => p.map((x, j) => (j === i ? v : x)))} aria-label={`Следить за чатом ${n}`} />
        </label>
      ))}
    </div>
  );
}

function BentoCard({ n, title, text, children, className }: { n: string; title: string; text: string; children: React.ReactNode; className?: string }) {
  return (
    <Reveal className={cn("group flex flex-col rounded-[20px] border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-card", className)}>
      <div className="bg-product flex-1 rounded-2xl p-4">{children}</div>
      <p className="mt-6 font-mono text-xs text-primary">{n}</p>
      <h3 className="mt-1.5 text-[21px] font-bold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-[15px] text-muted-foreground">{text}</p>
    </Reveal>
  );
}

/* ---------- Both sides ---------- */
const mine: { t: string; who: string; when: string; s: Status }[] = [
  { t: "Отправить документы", who: "Андрей", when: "Понедельник", s: "soon" },
  { t: "Вернуть 40 BYN", who: "Саша", when: "До зарплаты", s: "tracking" },
  { t: "Посмотреть договор", who: "Ольга", when: "Четверг", s: "done" },
];
const theirs: { t: string; who: string; when: string; s: Status }[] = [
  { t: "Прислать макет", who: "Марина", when: "Среда", s: "waiting" },
  { t: "Перезвонить по ремонту", who: "Игорь", when: "Вчера", s: "overdue" },
  { t: "Отдать зарядку", who: "Лёша", when: "Выходные", s: "tracking" },
];

export function BothSides() {
  return (
    <section className="bg-background-warm px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead title={<>Что обещал ты.<br />Что обещали тебе.</>} />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <SideCard title="Я обещал" items={mine} />
          <SideCard title="Мне обещали" items={theirs} delay={0.1} />
        </div>
      </div>
    </section>
  );
}

function SideCard({ title, items, delay }: { title: string; items: typeof mine; delay?: number | undefined }) {
  const [filter, setFilter] = useState<"open" | "all">("open");
  const shown = filter === "open" ? items.filter((i) => i.s !== "done") : items;
  return (
    <Reveal delay={delay} className="rounded-[20px] border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[22px] font-bold tracking-tight">{title}</h3>
        <div className="flex rounded-lg bg-secondary p-0.5 text-xs font-semibold">
          {(["open", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("rounded-md px-2.5 py-1.5 transition-colors", filter === f ? "bg-card text-foreground shadow-soft" : "text-muted-foreground")}>
              {f === "open" ? "Открытые" : "Все"}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        <AnimatePresence initial={false}>
          {shown.map((i) => (
            <motion.li layout key={i.t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between gap-3 rounded-xl bg-background px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold">{i.t}</p>
                <p className="text-xs text-muted-foreground">{i.who} · {i.when}</p>
              </div>
              <StatusBadge status={i.s} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Reveal>
  );
}

/* ---------- How ---------- */
export function How() {
  return (
    <section id="how" className="scroll-mt-20 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead title="Как это работает" sub="Три шага — и договорённости больше не теряются в ленте сообщений." />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <Step n="01" title="Подключи Telegram" text="Авторизуйся и выбери личные чаты, за которыми нужно следить.">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Номер телефона</p>
              <p className="mt-1 font-mono text-sm">+375 •• ••• •• 21</p>
              <div className="mt-3 flex h-9 items-center justify-center rounded-[10px] bg-primary text-sm font-semibold text-primary-foreground">Продолжить</div>
            </div>
          </Step>
          <Step n="02" title="Продолжай общаться" text="Сервис замечает договорённости в выбранных переписках." delay={0.08}>
            <div className="space-y-2 rounded-xl bg-background-warm p-3">
              <Bubble side="in">Заберёшь посылку завтра?</Bubble>
              <Bubble side="out"><span className="rounded bg-primary-soft px-0.5 ring-1 ring-primary/20">Да, после работы</span></Bubble>
            </div>
          </Step>
          <Step n="03" title="Получай ясную картину" text="Проверяй обещания, изменения и ожидаемые ответы в личном кабинете." delay={0.16}>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["4", "Я обещал"], ["2", "Мне"], ["1", "Ждёт"]].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-border bg-card py-3">
                  <p className="text-xl font-bold">{v}</p>
                  <p className="text-[11px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </Step>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, text, children, delay }: { n: string; title: string; text: string; children: React.ReactNode; delay?: number | undefined }) {
  return (
    <Reveal delay={delay} className="rounded-[20px] border border-border bg-card p-6">
      <div className="bg-product flex min-h-[170px] flex-col justify-center rounded-2xl p-4">{children}</div>
      <p className="mt-6 font-mono text-xs text-primary">{n}</p>
      <h3 className="mt-1.5 text-[21px] font-bold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-[15px] text-muted-foreground">{text}</p>
    </Reveal>
  );
}

/* ---------- Privacy ---------- */
export function Privacy() {
  const items = [
    { icon: MousePointerClick, t: "Только выбранные личные чаты", d: "Сервис смотрит только те переписки, которые ты сам отметил. Остальные — не трогает." },
    { icon: Eye, t: "Контроль за подключением", d: "Отслеживание любого чата можно выключить в один клик в разделе «Чаты и покрытие»." },
    { icon: MessageSquareText, t: "Без ручного копирования", d: "Не нужно пересылать сообщения боту или переписывать обещания в заметки." },
    { icon: Hand, t: "Действия — за тобой", d: "Сервис ничего не отправляет собеседникам сам. Черновики ответа ты копируешь вручную." },
  ];
  return (
    <section id="privacy" className="scroll-mt-20 bg-ink px-5 py-24 text-ink-foreground sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-foreground/10"><Lock className="h-5 w-5" /></span>
          <h2 className="display mt-6 text-[36px] sm:text-[48px] lg:text-[56px]">Твои переписки.<br />Твои правила.</h2>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-foreground/65">
            Мы честно описываем, что сервис делает и чего не делает. Подробности о хранении данных — в политике конфиденциальности.
          </p>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-[20px] bg-ink-foreground/10 sm:grid-cols-2">
          {items.map((i, k) => (
            <Reveal key={i.t} delay={k * 0.06} className="bg-ink p-6">
              <i.icon className="h-5 w-5 text-primary-soft" />
              <h3 className="mt-4 text-[17px] font-bold">{i.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-foreground/60">{i.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHead center title="Один тариф. Без сюрпризов." sub="Попробуй бесплатно, а дальше — продлевай вручную, когда удобно." />
        <Reveal className="mt-14 overflow-hidden rounded-[24px] border border-border bg-card shadow-float">
          <div className="grid md:grid-cols-2">
            <div className="p-8 sm:p-10">
              <p className="text-sm font-semibold text-primary">Попробуй бесплатно</p>
              <p className="display mt-3 text-[64px]">3 дня</p>
              <p className="mt-2 text-muted-foreground">До 1 000 сообщений за период</p>
              <Button asChild size="lg" className="mt-8 w-full">
                <Link to="/app">Начать бесплатно <ArrowRight /></Link>
              </Button>
            </div>
            <div className="border-t border-border bg-background p-8 sm:p-10 md:border-l md:border-t-0">
              <p className="text-sm font-semibold text-muted-foreground">Далее</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="display text-[44px]">30 BYN</span>
                <span className="text-muted-foreground">/ 30 дней</span>
              </p>
              <ul className="mt-6 space-y-3 text-[15px]">
                {["До 5 000 сообщений за платный период", "Без автосписаний — оплата вручную", "Все возможности сервиса"].map((t) => (
                  <li key={t} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border px-8 py-5 text-sm leading-relaxed text-muted-foreground sm:px-10">
            Сообщения считаются только в отслеживаемых чатах. Когда лимит или срок заканчивается, анализ новых сообщений приостанавливается — уже найденные договорённости остаются доступны.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- CTA + Footer ---------- */
export function FinalCta() {
  return (
    <section className="px-5 pb-24">
      <Reveal className="bg-cta relative mx-auto max-w-6xl overflow-hidden rounded-[28px] px-6 py-20 text-center text-primary-foreground sm:py-28">
        <div className="grid-dots absolute inset-0 opacity-30" aria-hidden />
        <div className="relative">
          <h2 className="display mx-auto max-w-3xl text-[36px] sm:text-[56px]">Меньше держать в голове.<br />Больше успевать в жизни.</h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] text-primary-foreground/75">
            Обещания, сроки и важные ответы — под контролем, даже когда разговор продолжается.
          </p>
          <Button asChild size="lg" variant="outline" className="mt-9 border-transparent">
            <Link to="/app">Попробовать бесплатно <ArrowUpRight /></Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Logo />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-foreground">{n.label}</a>)}
          <Link to="/privacy" className="hover:text-foreground">Политика конфиденциальности</Link>
          <Link to="/terms" className="hover:text-foreground">Условия использования</Link>
        </nav>
        <p className="text-sm text-muted-foreground">© 2026 Договорено</p>
      </div>
    </footer>
  );
}

export { Play };
