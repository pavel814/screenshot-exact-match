import { useState } from "react";
import { toast } from "sonner";
import { useAgreements, type Agreement } from "@/lib/agreements";
import { ActionDialogs, DetailDrawer, type DialogKind } from "./AgreementDialogs";
import type { CardAction } from "./AgreementCard";

export function useAgreementActions() {
  const { items, markDone, restore } = useAgreements();
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ id: string; kind: DialogKind } | null>(null);

  const drawerItem = items.find((i) => i.id === drawerId) ?? null;
  const dialogItem = items.find((i) => i.id === dialog?.id) ?? null;

  const done = (a: Agreement) => {
    markDone(a.id);
    toast.success("Отмечено как выполненное", { description: a.title });
  };

  const onAction = (action: CardAction, a: Agreement) => {
    if (action === "open" || action === "source") setDrawerId(a.id);
    else if (action === "done") done(a);
    else if (action === "restore") {
      restore(a.id);
      toast.success("Снова под контролем", { description: a.title });
    } else setDialog({ id: a.id, kind: action });
  };

  const ui = (
    <>
      <DetailDrawer
        a={drawerItem}
        onClose={() => setDrawerId(null)}
        onAction={(k) => {
          if (!drawerItem) return;
          if (k === "done") done(drawerItem);
          else setDialog({ id: drawerItem.id, kind: k });
        }}
      />
      <ActionDialogs a={dialogItem} kind={dialog?.kind ?? null} onClose={() => setDialog(null)} />
    </>
  );

  return { onAction, ui };
}
