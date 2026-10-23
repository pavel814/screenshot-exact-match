import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "@/components/landing/HeroDemo";
import { Scenarios } from "@/components/landing/Scenarios";
import { SectionHead } from "@/components/landing/primitives";
import { Header, Features, BothSides, How, Privacy, Pricing, FinalCta, Footer } from "@/components/landing/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Договорено — помнит обещания из Telegram-переписок" },
      { name: "description", content: "Договорено замечает обещания в выбранных Telegram-чатах, учитывает переносы сроков и напоминает о следующем шаге." },
      { property: "og:title", content: "Договорено — договорённости, которые не теряются" },
      { property: "og:description", content: "Помнит, что ты обещал. Следит за тем, что обещали тебе." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const reduce = useReducedMotion();
  const up = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <section className="px-5 pb-20 pt-32 sm:pt-40">
          <div className="mx-auto max-w-4xl text-center">
            <motion.p {...up(0)} className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[13px] font-semibold text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Помощник для личных чатов Telegram
            </motion.p>
            <motion.h1 {...up(0.05)} className="display text-[42px] sm:text-[64px] lg:text-[84px]">
              Помнит, что ты обещал.<br />
              <span className="text-muted-foreground">Следит за тем, что обещали тебе.</span>
            </motion.h1>
            <motion.p {...up(0.12)} className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">
              «Договорено» замечает обещания в выбранных Telegram-чатах, учитывает переносы сроков и помогает вовремя сделать следующий шаг.
            </motion.p>
            <motion.div {...up(0.18)} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg"><Link to="/app">Попробовать 3 дня <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><a href="#lifecycle"><Play /> Посмотреть, как работает</a></Button>
            </motion.div>
            <motion.p {...up(0.24)} className="mt-6 text-[13px] font-medium text-muted-foreground">
              3 дня бесплатно · Без автосписаний · Только выбранные чаты
            </motion.p>
          </div>
          <motion.div {...up(0.3)} className="mt-16 sm:mt-20">
            <HeroDemo />
          </motion.div>
        </section>

        <section id="lifecycle" className="scroll-mt-20 px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <SectionHead center eyebrow="Не список дел. Жизнь договорённости." title={<>Разговор меняется.<br />Договорённость — вместе с ним.</>} />
            <div className="mt-12"><Scenarios /></div>
          </div>
        </section>

        <Features />
        <BothSides />
        <How />
        <Privacy />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
