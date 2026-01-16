import React from "react";
import { cn } from "@/utils/cn";
import { APP_CONFIG } from "@/lib/config";
import { useStore } from "@/state/store";
import { Button } from "@/components/ui/Button";

export function Shell({
  nav,
  header,
  rightPanel,
  children,
}: {
  nav: React.ReactNode;
  header: React.ReactNode;
  rightPanel?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { auth, logout } = useStore();
  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-90 [background:radial-gradient(1200px_circle_at_20%_-20%,rgba(34,197,94,0.18),transparent_40%),radial-gradient(800px_circle_at_90%_10%,rgba(245,158,11,0.12),transparent_35%),radial-gradient(1000px_circle_at_40%_120%,rgba(56,189,248,0.09),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_1fr_340px]">
        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="text-xs text-white/60">{APP_CONFIG.brand.hotelName}</div>
                <div className="text-base font-semibold tracking-tight">
                  {APP_CONFIG.brand.name}
                </div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-b from-amber-300/30 to-emerald-400/20 ring-1 ring-white/10" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
              {nav}
            </div>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Signed in</div>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white/90">
                    {auth?.username ?? "—"}
                  </div>
                  <div className="text-xs text-white/60">{auth?.role ?? ""}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <div className={cn("rounded-2xl border border-white/10 bg-white/5")}> 
            {header}
          </div>
          <div className="mt-4">{children}</div>
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <div className="rounded-2xl border border-white/10 bg-white/5">
              {rightPanel}
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
        <div className="rounded-2xl border border-white/10 bg-[#0a1020]/80 backdrop-blur-xl">
          {nav}
        </div>
      </div>
    </div>
  );
}
