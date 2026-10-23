import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/ui";
export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Настройки — Договорено" }, { name: "description", content: "Настройки в сервисе Договорено." }, { property: "og:title", content: "Настройки — Договорено" }, { property: "og:description", content: "Настройки в сервисе Договорено." }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-0 py-4">
      <PageHeader title="Настройки" />
      <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
        Раздел в работе. <Link to="/" className="font-semibold text-primary">На главную</Link>
      </div>
    </div>
  ),
});
