export function PageHeader({ title, right, eyebrow = "Личный кабинет", sub }: { title: string; right?: React.ReactNode; eyebrow?: string; sub?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-2 text-[32px] sm:text-[40px]">{title}</h1>
        {sub && <p className="mt-2 text-[15px] text-muted-foreground">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function DemoNotice() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-warning/25 bg-warning-soft px-4 py-3 text-sm text-foreground">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-warning" />
      <p>
        <span className="font-semibold">Демо-режим.</span> Данные тестовые, изменения хранятся до перезагрузки страницы. Платежи и подключение Telegram выключены.
      </p>
    </div>
  );
}
