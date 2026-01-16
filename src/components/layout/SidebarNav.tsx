import { cn } from "@/utils/cn";

export type NavKey = "calls" | "orders" | "menu" | "analytics" | "tickets" | "settings";

const items: Array<{ key: NavKey; label: string; hint: string }> = [
  { key: "calls", label: "Live Calls", hint: "Agents & voice" },
  { key: "orders", label: "Orders", hint: "Kitchen timeline" },
  { key: "menu", label: "Menu", hint: "Structured DB" },
  { key: "analytics", label: "Analytics", hint: "KPIs & AI insights" },
  { key: "tickets", label: "Tickets", hint: "Escalations" },
  { key: "settings", label: "Settings", hint: "Integrations" },
];

export function SidebarNav({
  active,
  onChange,
}: {
  active: NavKey;
  onChange: (k: NavKey) => void;
}) {
  return (
    <nav className="grid grid-cols-3 gap-1 p-2 lg:grid-cols-1">
      {items.map((it) => {
        const is = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={cn(
              "group rounded-xl px-3 py-2 text-left transition",
              is
                ? "bg-gradient-to-b from-emerald-400/20 to-emerald-400/5 ring-1 ring-emerald-400/20"
                : "hover:bg-white/7"
            )}
          >
            <div className="text-sm font-medium text-white/90">{it.label}</div>
            <div className="hidden text-xs text-white/55 lg:block">{it.hint}</div>
          </button>
        );
      })}
    </nav>
  );
}
