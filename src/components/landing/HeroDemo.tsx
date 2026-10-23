import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles, CalendarClock } from "lucide-react";
import { Bubble, WindowChrome } from "./primitives";
import { StatusBadge } from "@/components/brand";

// Steps: 0 nothing, 1 promise msg, 2 detecting, 3 card, 4 reschedule msg, 5 card updated
const FINAL = 5;

export function HeroDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? FINAL : 0);

  useEffect(() => {
    if (reduce) {
      setStep(FINAL);
      return;
    }
    const delays = [500, 1100, 1100, 1700, 1300, 4200];
    const t = setTimeout(() => setStep((s) => (s >= FINAL ? 0 : s + 1)), delays[step]);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const fade = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="bg-product grid-dots absolute -inset-x-4 -inset-y-6 rounded-[32px] sm:-inset-x-10" aria-hidden />
      <div className="relative grid gap-5 p-4 sm:p-8 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-0">
        {/* Telegram */}
        <WindowChrome
          className="md:mr-[-28px] md:translate-y-6"
          title={
            <span className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-primary-deep">
                А
              </span>
              Андрей
              <span className="font-normal text-muted-foreground">· был недавно</span>
            </span>
          }
        >
          <div className="flex min-h-[260px] flex-col justify-end gap-2.5 bg-background-warm p-4">
            <AnimatePresence>
              {step >= 1 && (
                <motion.div key="m1" {...fade}>
                  <Bubble side="in" time="11:02">Скинешь документы в пятницу?</Bubble>
                </motion.div>
              )}
              {step >= 1 && (
                <motion.div key="m2" {...fade} transition={{ ...fade.transition, delay: 0.35 }}>
                  <Bubble side="out" time="11:04">
                    <span
                      className={
                        step >= 2
                          ? "rounded bg-primary-soft px-0.5 text-primary-deep ring-1 ring-primary/20 transition-colors"
                          : ""
                      }
                    >
                      Да, до обеда.
                    </span>
                  </Bubble>
                </motion.div>
              )}
              {step >= 4 && (
                <motion.div key="m3" {...fade}>
                  <p className="my-1 text-center font-mono text-[10px] text-muted-foreground">Четверг</p>
                  <Bubble side="out" time="19:40">
                    <span className={step >= 5 ? "rounded bg-warning-soft px-0.5 ring-1 ring-warning/20" : ""}>
                      Не успею, отправлю в понедельник.
                    </span>
                  </Bubble>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </WindowChrome>

        {/* Dogovoreno */}
        <WindowChrome
          className="relative z-10 md:-translate-y-4"
          title={<span className="flex items-center gap-2">Договорено · Я обещал</span>}
          right={
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              Автоконтроль
            </span>
          }
        >
          <div className="min-h-[300px] bg-background p-4 sm:p-5">
            <AnimatePresence mode="wait">
              {step === 2 && (
                <motion.div
                  key="detect"
                  {...fade}
                  className="flex h-[260px] flex-col items-center justify-center gap-3 text-center"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <p className="text-sm font-semibold">Замечена договорённость</p>
                  <p className="text-xs text-muted-foreground">«Да, до обеда» → обещание с датой</p>
                </motion.div>
              )}
              {step < 2 && (
                <motion.div key="empty" {...fade} className="space-y-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="rounded-2xl border border-dashed border-border p-4">
                      <div className="h-2.5 w-24 rounded bg-neutral-soft" />
                      <div className="mt-3 h-3.5 w-48 rounded bg-neutral-soft" />
                      <div className="mt-3 h-2.5 w-32 rounded bg-neutral-soft" />
                    </div>
                  ))}
                </motion.div>
              )}
              {step >= 3 && (
                <motion.div key="card" {...fade}>
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <p className="eyebrow text-primary">Я обещал</p>
                      <motion.div layout>
                        <StatusBadge status={step >= 5 ? "soon" : "tracking"} />
                      </motion.div>
                    </div>
                    <h3 className="mt-2 text-[19px] font-bold tracking-tight">Отправить документы Андрею</h3>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[13px]">
                      <div className="rounded-xl bg-background p-3">
                        <p className="text-muted-foreground">{step >= 5 ? "Было" : "Срок"}</p>
                        <p
                          className={
                            step >= 5
                              ? "mt-0.5 font-semibold text-muted-foreground line-through"
                              : "mt-0.5 font-semibold"
                          }
                        >
                          Пятница, до 13:00
                        </p>
                      </div>
                      <div
                        className={
                          step >= 5
                            ? "rounded-xl bg-primary-soft p-3 transition-colors"
                            : "rounded-xl bg-background p-3 opacity-50"
                        }
                      >
                        <p className="flex items-center gap-1 text-muted-foreground">
                          Стало <ArrowRight className="h-3 w-3" />
                        </p>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={step >= 5 ? "mon" : "none"}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-0.5 font-semibold text-primary-deep"
                          >
                            {step >= 5 ? "Понедельник" : "—"}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {step >= 5 ? "Изменение замечено автоматически" : "Напомню в пятницу утром"}
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl border border-border bg-card/60 p-4 opacity-70">
                    <p className="eyebrow">Мне обещали</p>
                    <p className="mt-1.5 text-sm font-semibold">Марина пришлёт макет к среде</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </WindowChrome>
      </div>
    </div>
  );
}
