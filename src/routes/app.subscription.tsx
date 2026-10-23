import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/ui";
export const Route = createFileRoute("/app/subscription")({
  head: () => ({ meta: [{ title: "Подписка — Договорено" }, { name: "description", content: "Подписка в сервисе Договорено." }, { property: "og:title", content: "Подписка — Договорено" }, { property: "og:description", content: "Подписка в сервисе Договорено." }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-0 py-4">
      <PageHeader title="Подписка" />
      <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
        Раздел в работе. <Link to="/" className="font-semibold text-primary">На главную</Link>
      </div>
    </div>
  ),
});
