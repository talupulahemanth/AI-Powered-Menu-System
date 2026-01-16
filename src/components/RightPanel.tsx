import React, { useMemo } from "react";
import { useStore } from "@/state/store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/mockServer";

export type Selection =
  | { kind: "call"; id: string }
  | { kind: "order"; id: string }
  | { kind: "ticket"; id: string }
  | { kind: "menu"; id: string }
  | null;

export function RightPanel({ selection }: { selection: Selection }) {
  const { db } = useStore();

  const content = useMemo(() => {
    if (!selection || !db) return null;
    if (selection.kind === "call") return db.calls.find((c) => c.id === selection.id) ?? null;
    if (selection.kind === "order") return db.orders.find((o) => o.id === selection.id) ?? null;
    if (selection.kind === "ticket") return db.tickets.find((t) => t.id === selection.id) ?? null;
    if (selection.kind === "menu") return db.menu.find((m) => m.id === selection.id) ?? null;
    return null;
  }, [selection, db]);

  if (!selection) {
    return (
      <div className="p-4">
        <div className="text-sm font-semibold text-white/90">Context</div>
        <div className="mt-2 text-sm text-white/60">
          Select a call, order, ticket, or menu item to see details.
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-4">
        <div className="text-sm text-white/70">Not found.</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-sm font-semibold text-white/90">Details</div>
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <pre className="whitespace-pre-wrap text-xs text-white/75">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>

      {selection.kind === "call" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => api.createTicket(selection.id, { urgency: "high", category: "handover" })}
          >
            Create ticket
          </Button>
          <Badge tone="neutral">Supervisor tools (whisper/barge-in) in call modal</Badge>
        </div>
      ) : null}
    </div>
  );
}
