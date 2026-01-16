import React, { useMemo, useState } from "react";
import { StoreProvider, useStore } from "@/state/store";
import { SidebarNav, type NavKey } from "@/components/layout/SidebarNav";
import { Shell } from "@/components/layout/Shell";
import { TopHeader } from "@/components/layout/TopHeader";
import { LiveCallsView } from "@/views/LiveCallsView";
import { CallingView } from "@/views/CallingView";
import { OrdersView } from "@/views/OrdersView";
import { MenuView } from "@/views/MenuView";
import { AnalyticsView } from "@/views/AnalyticsView";
import { TicketsView } from "@/views/TicketsView";
import { SettingsView } from "@/views/SettingsView";
import { RightPanel, type Selection } from "@/components/RightPanel";
import { Button } from "@/components/ui/Button";
import type { Role } from "@/lib/types";
import { api } from "@/lib/mockServer";

function Login() {
  const { login } = useStore();
  const [username, setUsername] = useState("supervisor");
  const [role, setRole] = useState<Role>("supervisor");

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(1200px_circle_at_20%_-20%,rgba(34,197,94,0.18),transparent_40%),radial-gradient(800px_circle_at_90%_10%,rgba(245,158,11,0.12),transparent_35%),radial-gradient(1000px_circle_at_40%_120%,rgba(56,189,248,0.09),transparent_40%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-xl items-center p-6">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_140px_rgba(0,0,0,0.7)]">
          <div className="text-xs text-white/60">Aurum • Staff Console</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">Sign in</div>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-white/60">Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/90 outline-none"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-white/60">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/90 outline-none"
              >
                <option value="admin">admin</option>
                <option value="supervisor">supervisor</option>
                <option value="staff">staff</option>
              </select>
            </label>
            <Button
              onClick={() => {
                login(username.trim() || "staff", role);
              }}
            >
              Continue
            </Button>
          </div>
          <div className="mt-4 text-xs text-white/55">
            Demo authentication. Production: JWT via backend with RBAC, auditing, and tenant isolation.
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthedApp() {
  const [nav, setNav] = useState<NavKey>("calls");
  const [selection, setSelection] = useState<Selection>(null);

  const header = useMemo(() => {
    const map: Record<NavKey, { title: string; sub: string }> = {
      calls: { title: "Live Calls", sub: "10+ virtual agents • multilingual • supervisor tools" },
      calling: { title: "AI Assistant Calling", sub: "Text & voice AI ordering • order integration" },
      orders: { title: "Orders", sub: "Timeline • POS routing • dietary & allergen flags" },
      menu: { title: "Menu Management", sub: "Structured DB • AI sync • file import" },
      analytics: { title: "Analytics", sub: "KPIs • language/dietary mix • AI insights" },
      tickets: { title: "Tickets", sub: "Escalations • risk handling • routing" },
      settings: { title: "Settings", sub: "POS/LLM/Telephony configuration hooks" },
    };
    const it = map[nav];
    return (
      <TopHeader
        title={it.title}
        subtitle={it.sub}
        onSimulateCall={nav === "calls" ? () => api.simulateInboundCall() : undefined}
      />
    );
  }, [nav]);

  const main = useMemo(() => {
    switch (nav) {
      case "calls":
        return <LiveCallsView onSelect={setSelection} />;
      case "calling":
        return <CallingView />;
      case "orders":
        return <OrdersView onSelect={setSelection} />;
      case "menu":
        return <MenuView onSelect={setSelection} />;
      case "analytics":
        return <AnalyticsView />;
      case "tickets":
        return <TicketsView onSelect={setSelection} />;
      case "settings":
        return <SettingsView />;
    }
  }, [nav]);

  return (
    <Shell
      nav={<SidebarNav active={nav} onChange={setNav} />}
      header={header}
      rightPanel={<RightPanel selection={selection} />}
    >
      {main}
    </Shell>
  );
}

function Root() {
  const { auth } = useStore();
  if (!auth) return <Login />;
  return <AuthedApp />;
}

export function App() {
  return (
    <StoreProvider>
      <Root />
    </StoreProvider>
  );
}
