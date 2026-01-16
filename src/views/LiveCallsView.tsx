import React, { useMemo, useState } from "react";
import { Card3D } from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/mockServer";
import { useStore } from "@/state/store";
import type { CallSession } from "@/lib/types";

function statusTone(s: CallSession["status"]) {
  switch (s) {
    case "browsing":
      return "neutral";
    case "ordering":
      return "info";
    case "confirming":
      return "gold";
    case "escalated":
      return "danger";
    case "ended":
      return "success";
  }
}

export function LiveCallsView({
  onSelect,
}: {
  onSelect: (entity: { kind: "call"; id: string }) => void;
}) {
  const { db } = useStore();
  const [selected, setSelected] = useState<CallSession | null>(null);
  const [whisper, setWhisper] = useState("");

  const calls = useMemo(() => {
    const list = db?.calls ?? [];
    return [...list].sort((a, b) => (a.status === "ended" ? 1 : -1) - (b.status === "ended" ? 1 : -1));
  }, [db]);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {calls.map((c) => (
          <Card3D
            key={c.id}
            onClick={() => {
              setSelected(c);
              onSelect({ kind: "call", id: c.id });
            }}
            className="p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white/95">
                  {c.guestName ?? "Guest"} <span className="text-white/50">•</span>{" "}
                  Room {c.roomNumber ?? "TBD"}
                </div>
                <div className="mt-1 text-xs text-white/55">
                  {c.agent} • Lang: {c.language.toUpperCase()} • {Math.round(c.durationSec / 60)}m
                </div>
              </div>
              <Badge tone={statusTone(c.status)}>{c.status.replaceAll("_", " ")}</Badge>
            </div>
            <div className="mt-3 text-sm text-white/70 line-clamp-3">
              {c.transcriptSnippet}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  api.updateCall(c.id, { status: "escalated" });
                  api.createTicket(c.id, { category: "handover", urgency: "high" });
                }}
              >
                Force escalate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect({ kind: "call", id: c.id });
                }}
              >
                Inspect
              </Button>
            </div>
          </Card3D>
        ))}
      </div>

      <Modal
        open={!!selected}
        title={selected ? `Call ${selected.id}` : "Call"}
        onClose={() => setSelected(null)}
        footer={
          selected ? (
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-white/60">
                Whisper: visible to AI only (conceptual)
              </div>
              <div className="flex w-full gap-2 md:w-auto">
                <input
                  value={whisper}
                  onChange={(e) => setWhisper(e.target.value)}
                  placeholder="e.g., Confirm halal certification with kitchen..."
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/90 outline-none placeholder:text-white/35"
                />
                <Button
                  onClick={async () => {
                    if (!selected) return;
                    await api.whisperToAgent(selected.id, whisper);
                    setWhisper("");
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Guest</div>
                <div className="text-sm text-white/90">
                  {selected.guestName ?? "Unknown"}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Room</div>
                <div className="text-sm text-white/90">
                  {selected.roomNumber ?? "TBD"}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Language</div>
                <div className="text-sm text-white/90">{selected.language.toUpperCase()}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Status</div>
                <div className="text-sm text-white/90">{selected.status}</div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Transcript snippet</div>
              <div className="mt-1 text-sm text-white/80">{selected.transcriptSnippet}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={async () => {
                  await api.createTicket(selected.id, {
                    category: "handover",
                    urgency: "high",
                    summary: "Supervisor requested barge-in (conceptual).",
                  });
                  await api.updateCall(selected.id, { status: "escalated" });
                }}
              >
                Barge in (create ticket)
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  await api.updateCall(selected.id, { status: "ended" });
                  setSelected(null);
                }}
              >
                End call
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
