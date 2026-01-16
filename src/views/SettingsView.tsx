import React from "react";
import { Card3D } from "@/components/ui/Card3D";
import { APP_CONFIG } from "@/lib/config";
import { Badge } from "@/components/ui/Badge";

export function SettingsView() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card3D interactive={false} className="p-5">
        <div className="text-sm font-semibold text-white/90">Providers</div>
        <div className="mt-4 grid gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/60">LLM provider</div>
                <div className="mt-1 text-sm text-white/85">{APP_CONFIG.providers.llm.type}</div>
              </div>
              <Badge tone="neutral">Config via VITE_LLM_PROVIDER</Badge>
            </div>
            <div className="mt-2 text-xs text-white/55">
              In production, route through a server-side orchestrator with auditing and redaction.
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/60">POS provider</div>
                <div className="mt-1 text-sm text-white/85">{APP_CONFIG.providers.pos.type}</div>
              </div>
              <Badge tone="neutral">Config via VITE_POS_PROVIDER</Badge>
            </div>
            <div className="mt-2 text-xs text-white/55">
              Oracle Micros integration is represented as an interface; replace mock adapter with real API mapping.
            </div>
          </div>
        </div>
      </Card3D>

      <Card3D interactive={false} className="p-5">
        <div className="text-sm font-semibold text-white/90">Security posture (demo)</div>
        <div className="mt-4 space-y-2 text-sm text-white/75">
          <div>• JWT auth & RBAC are modeled client-side for this build artifact.</div>
          <div>• Production setup: server-issued tokens, httpOnly cookies, audit logs, encryption at rest.</div>
          <div>• Multi-tenant: isolate by hotelId; apply row-level access controls.</div>
        </div>
      </Card3D>

      <Card3D interactive={false} className="p-5 xl:col-span-2">
        <div className="text-sm font-semibold text-white/90">Backend architecture blueprint</div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">API</div>
            <div className="mt-2 text-sm text-white/80">
              Node.js (Fastify/Express) + WebSocket for live calls, orders, tickets.
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">AI Orchestration</div>
            <div className="mt-2 text-sm text-white/80">
              Tool-augmented LLM with strict menu DB querying, summarization, routing, anomaly detection.
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Telephony</div>
            <div className="mt-2 text-sm text-white/80">
              SIP/VoIP provider → ASR → LLM → TTS streaming pipeline; 10+ virtual agents via horizontal workers.
            </div>
          </div>
        </div>
      </Card3D>
    </div>
  );
}
