import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, MessagesSquare, Settings, CreditCard, LogOut, Menu, ChevronRight } from "lucide-react";
import { Logo } from "@/components/brand";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AgreementsProvider } from "@/lib/agreements";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Личный кабинет — Договорено" },
      { name: "description", content: "Ваши договорённости, чаты и подписка в Договорено." },
      { property: "og:title", content: "Личный кабинет — Договорено" },
      { property: "og:description", content: "Обещания, сроки и ожидаемые ответы в одном месте." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

const items = [
  { to: "/app", label: "Договорённости", icon: ListChecks },
  { to: "/app/chats", label: "Чаты и покрытие", icon: MessagesSquare },
  { to: "/app/settings", label: "Настройки", icon: Settings },
  { to: "/app/subscription", label: "Подписка", icon: CreditCard },
] as const;

const EMAIL = "pavel.yahimovich@gmail.com";

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = (to: string) => (to === "/app" ? path === "/app" || path === "/app/" || path.startsWith("/app/history") : path.startsWith(to));
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-6">
        <Logo to="/app" />
      </div>
      <nav className="flex flex-col gap-1 px-3" aria-label="Кабинет">
        {items.map((i) => (
          <Link
            key={i.to}
            to={i.to}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[15px] font-semibold transition-colors",
              active(i.to) ? "bg-primary-soft text-primary-deep" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {active(i.to) && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r bg-primary" />}
            <i.icon className="h-[18px] w-[18px]" />
            {i.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-border p-3">
        <Link to="/app/settings" onClick={onNavigate} className="flex items-center gap-3 rounded-[10px] p-2.5 hover:bg-secondary">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary-deep">П</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Павел</span>
            <span className="block truncate text-xs text-muted-foreground">{EMAIL}</span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link to="/" onClick={onNavigate} className="mt-1 flex items-center gap-3 rounded-[10px] px-2.5 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground">
          <LogOut className="h-4 w-4" /> Выйти
        </Link>
      </div>
    </div>
  );
}

function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <AgreementsProvider>
      <div className="min-h-screen bg-background">
        <aside className="fixed inset-y-0 left-0 hidden w-[248px] border-r border-border bg-sidebar lg:block">
          <Nav />
        </aside>
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:hidden">
          <Logo to="/app" />
          <Button variant="ghost" size="icon" aria-label="Открыть меню" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
        </header>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetTitle className="sr-only">Меню</SheetTitle>
            <Nav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <main className="lg:pl-[248px]">
          <div className="mx-auto max-w-[1080px] px-4 py-8 sm:px-8 lg:py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </AgreementsProvider>
  );
}

