import React, { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card3D } from "@/components/ui/Card3D";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/mockServer";
import { useStore } from "@/state/store";
import type { Order, OrderStatus } from "@/lib/types";

function tone(s: OrderStatus) {
  switch (s) {
    case "new":
      return "gold";
    case "in_kitchen":
      return "info";
    case "out_for_delivery":
      return "warning";
    case "delivered":
      return "success";
    case "cancelled":
      return "danger";
  }
}

export function OrdersView({
  onSelect,
}: {
  onSelect: (entity: { kind: "order"; id: string }) => void;
}) {
  const { db } = useStore();
  const orders = useMemo(() => db?.orders ?? [], [db]);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {orders.map((o) => (
          <Card3D
            key={o.id}
            className="p-4"
            onClick={() => onSelect({ kind: "order", id: o.id })}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white/95">
                  {o.id} <span className="text-white/50">•</span> Room {o.roomNumber}
                </div>
                <div className="mt-1 text-xs text-white/55">
                  {o.guestName ?? "Guest"} • ETA {o.etaMins}m • POS: {o.posProvider}
                </div>
              </div>
              <Badge tone={tone(o.status)}>{o.status.replaceAll("_", " ")}</Badge>
            </div>

            <div className="mt-3 text-sm text-white/75">
              {o.items.slice(0, 2).map((it) => (
                <div key={it.itemId} className="flex justify-between">
                  <span className="truncate">
                    {it.qty}× {it.name}
                  </span>
                  <span className="text-white/60">£{(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
              {o.items.length > 2 ? (
                <div className="text-xs text-white/45">+{o.items.length - 2} more…</div>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {o.dietaryFlags.slice(0, 4).map((d) => (
                <Badge key={d} tone="neutral">
                  {d}
                </Badge>
              ))}
              {o.allergenFlags.slice(0, 3).map((a) => (
                <Badge key={a} tone="danger">
                  {a}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  const next: Record<OrderStatus, OrderStatus> = {
                    new: "in_kitchen",
                    in_kitchen: "out_for_delivery",
                    out_for_delivery: "delivered",
                    delivered: "delivered",
                    cancelled: "cancelled",
                  };
                  api.updateOrder(o.id, { status: next[o.status] });
                }}
              >
                Advance status
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  api.updateOrder(o.id, { status: "cancelled" });
                }}
              >
                Cancel
              </Button>
            </div>

            <div className="mt-3 border-t border-white/10 pt-3 text-xs text-white/55">
              Total: <span className="text-white/85">£{o.total.toFixed(2)}</span>
            </div>
          </Card3D>
        ))}
      </div>
    </div>
  );
}
