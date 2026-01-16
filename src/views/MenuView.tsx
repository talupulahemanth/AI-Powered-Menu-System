import React, { useMemo, useState } from "react";
import { Card3D } from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/mockServer";
import { useStore } from "@/state/store";
import type { MenuItem } from "@/lib/types";

export function MenuView({
  onSelect,
}: {
  onSelect: (entity: { kind: "menu"; id: string }) => void;
}) {
  const { db } = useStore();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [json, setJson] = useState("");

  const menu = useMemo(() => db?.menu ?? [], [db]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-white/65">
          Structured menu DB (allergen-safe). Changes propagate to AI context.
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              const txt = await api.exportMenu();
              setJson(txt);
              setImportOpen(true);
            }}
          >
            Export JSON
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setJson("[");
              setImportOpen(true);
            }}
          >
            Import JSON
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menu.map((m) => (
          <Card3D
            key={m.id}
            className="p-4"
            onClick={() => {
              setEditing(m);
              onSelect({ kind: "menu", id: m.id });
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white/95">{m.name}</div>
                <div className="mt-1 text-xs text-white/55">
                  {m.category} • £{m.price.toFixed(2)} • {m.prepMins}m
                </div>
              </div>
              <Badge tone={m.available ? "success" : "warning"}>
                {m.available ? "Available" : "Paused"}
              </Badge>
            </div>

            <div className="mt-3 text-sm text-white/70 line-clamp-3">
              {m.description}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {m.dietary.slice(0, 4).map((d) => (
                <Badge key={d} tone="neutral">
                  {d}
                </Badge>
              ))}
              {m.allergens.slice(0, 3).map((a) => (
                <Badge key={a} tone="danger">
                  {a}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  api.updateMenuItem(m.id, { available: !m.available });
                }}
              >
                Toggle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(m);
                }}
              >
                Edit
              </Button>
            </div>
          </Card3D>
        ))}
      </div>

      <Modal
        open={!!editing}
        title={editing ? `Edit menu item • ${editing.id}` : "Edit"}
        onClose={() => setEditing(null)}
        footer={
          editing ? (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Close
              </Button>
              <Button
                onClick={async () => {
                  if (!editing) return;
                  await api.updateMenuItem(editing.id, editing);
                  setEditing(null);
                }}
              >
                Save
              </Button>
            </div>
          ) : null
        }
      >
        {editing ? (
          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-white/60">Name</span>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/90 outline-none"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-white/60">Description</span>
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="min-h-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-white/60">Price (£)</span>
                <input
                  type="number"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: Number(e.target.value) })
                  }
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/90 outline-none"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-white/60">Prep time (mins)</span>
                <input
                  type="number"
                  value={editing.prepMins}
                  onChange={(e) =>
                    setEditing({ ...editing, prepMins: Number(e.target.value) })
                  }
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/90 outline-none"
                />
              </label>
            </div>
            <div className="text-xs text-white/60">
              Dietary & allergen tags are authoritative. In production, editing would be role-gated and audited.
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={importOpen}
        title="Menu import/export (JSON)"
        onClose={() => setImportOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setImportOpen(false)}>
              Close
            </Button>
            <Button
              onClick={async () => {
                await api.importMenu(json);
                setImportOpen(false);
              }}
            >
              Import
            </Button>
          </div>
        }
      >
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          className="min-h-[300px] w-full rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs text-white/90 outline-none"
        />
      </Modal>
    </div>
  );
}
