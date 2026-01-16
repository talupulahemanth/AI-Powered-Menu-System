import React, { useMemo } from "react";
import { Card3D } from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/mockServer";
import { useStore } from "@/state/store";
import type { Ticket } from "@/lib/types";

function urgencyTone(u: Ticket["urgency"]) {
  switch (u) {
    case "low":
      return "neutral";
    case "medium":
      return "warning";
    case "high":
      return "danger";
    case "critical":
      return "danger";
  }
}

export function TicketsView({
  onSelect,
}: {
  onSelect: (entity: { kind: "ticket"; id: string }) => void;
}) {
  const { db } = useStore();
  const tickets = useMemo(() => db?.tickets ?? [], [db]);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {tickets.map((t) => (
          <Card3D
            key={t.id}
            className="p-4"
            onClick={() => onSelect({ kind: "ticket", id: t.id })}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white/95">
                  {t.category.replaceAll("_", " ")}
                  <span className="text-white/50"> • </span>
                  {t.id}
                </div>
                <div className="mt-1 text-xs text-white/55">
                  Room {t.roomNumber ?? "—"} • {t.guestName ?? "Guest"} • Lang {t.language.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={urgencyTone(t.urgency)}>{t.urgency}</Badge>
                <Badge tone={t.status === "open" ? "danger" : t.status === "resolved" ? "success" : "warning"}>
                  {t.status}
                </Badge>
              </div>
            </div>
            <div className="mt-3 text-sm text-white/75">{t.summary}</div>
            <div className="mt-3 text-xs text-white/55 line-clamp-2">
              {t.transcriptSnippet}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  api.updateTicket(t.id, { status: "acknowledged" });
                }}
              >
                Acknowledge
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  api.updateTicket(t.id, { status: "resolved" });
                }}
              >
                Resolve
              </Button>
            </div>
          </Card3D>
        ))}
      </div>
    </div>
  );
}
