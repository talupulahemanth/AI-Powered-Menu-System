import React, { useMemo } from "react";
import { Card3D } from "@/components/ui/Card3D";
import { useStore } from "@/state/store";

function bar(widthPct: number) {
  return (
    <div className="h-2 w-full rounded-full bg-white/8">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300"
        style={{ width: `${Math.max(3, Math.min(100, widthPct))}%` }}
      />
    </div>
  );
}

export function AnalyticsView() {
  const { db } = useStore();

  const kpi = useMemo(() => {
    const calls = db?.calls ?? [];
    const orders = db?.orders ?? [];
    const tickets = db?.tickets ?? [];
    const avgHandle =
      calls.length ? Math.round(calls.reduce((s, c) => s + c.durationSec, 0) / calls.length) : 0;
    const abandoned = calls.filter((c) => c.status === "ended" && c.durationSec < 45).length;
    const top = [...orders]
      .flatMap((o) => o.items)
      .reduce<Record<string, number>>((m, it) => {
        m[it.name] = (m[it.name] ?? 0) + it.qty;
        return m;
      }, {});
    const topItem = Object.entries(top).sort((a, b) => b[1] - a[1])[0];
    const byLang = calls.reduce<Record<string, number>>((m, c) => {
      m[c.language] = (m[c.language] ?? 0) + 1;
      return m;
    }, {});
    const byDiet = orders.reduce<Record<string, number>>((m, o) => {
      for (const d of o.dietaryFlags) m[d] = (m[d] ?? 0) + 1;
      return m;
    }, {});
    return {
      avgHandle,
      abandoned,
      openTickets: tickets.filter((t) => t.status !== "resolved").length,
      topItem,
      byLang,
      byDiet,
    };
  }, [db]);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card3D interactive={false} className="p-5">
        <div className="text-sm font-semibold text-white/90">KPIs</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Average handle time</div>
            <div className="mt-1 text-2xl font-semibold">
              {Math.round(kpi.avgHandle / 60)}m
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Abandoned calls</div>
            <div className="mt-1 text-2xl font-semibold">{kpi.abandoned}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Open escalations</div>
            <div className="mt-1 text-2xl font-semibold">{kpi.openTickets}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Top item</div>
            <div className="mt-1 text-sm text-white/85">
              {kpi.topItem ? `${kpi.topItem[0]} (${kpi.topItem[1]})` : "—"}
            </div>
          </div>
        </div>
      </Card3D>

      <Card3D interactive={false} className="p-5">
        <div className="text-sm font-semibold text-white/90">Calls by language</div>
        <div className="mt-4 grid gap-3">
          {Object.entries(kpi.byLang).map(([lang, count]) => (
            <div key={lang} className="grid gap-1">
              <div className="flex items-center justify-between text-xs text-white/65">
                <span>{lang.toUpperCase()}</span>
                <span>{count}</span>
              </div>
              {bar((count / Math.max(1, Math.max(...Object.values(kpi.byLang)))) * 100)}
            </div>
          ))}
        </div>
      </Card3D>

      <Card3D interactive={false} className="p-5 xl:col-span-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-white/90">AI-generated insights (mock)</div>
            <div className="text-xs text-white/55">
              In production, this is synthesized by LLM with safe redaction.
            </div>
          </div>
          <div className="text-xs text-white/50">Export: PDF/CSV (hook)</div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Today’s performance</div>
            <div className="mt-2 text-sm text-white/80">
              Demand peaked in the early evening. AI resolved common menu questions quickly, reducing supervisor interruptions.
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Common questions</div>
            <div className="mt-2 text-sm text-white/80">
              Allergens (nuts/shellfish) and halal confirmation were the top intents. Recommend surfacing allergen-safe filters in guest UIs.
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Opportunities</div>
            <div className="mt-2 text-sm text-white/80">
              Upsell pairing: English sparkling wine with sea bass. Promote late-night toastie after 22:00.
            </div>
          </div>
        </div>
      </Card3D>
    </div>
  );
}
