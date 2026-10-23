import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/ui";
export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Условия использования — Договорено" }, { name: "description", content: "Условия использования в сервисе Договорено." }, { property: "og:title", content: "Условия использования — Договорено" }, { property: "og:description", content: "Условия использования в сервисе Договорено." }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-0 py-4">
      <PageHeader title="Условия использования" />
      <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
        Раздел в работе. <Link to="/" className="font-semibold text-primary">На главную</Link>
      </div>
    </div>
  ),
});
