import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/state/store";

export function TopHeader({
  title,
  subtitle,
  onSimulateCall,
}: {
  title: string;
  subtitle?: string;
  onSimulateCall?: () => void;
}) {
  const { db } = useStore();
  const activeCalls = db?.calls.filter((c) => c.status !== "ended").length ?? 0;
  const openTickets = db?.tickets.filter((t) => t.status !== "resolved").length ?? 0;
  const inFlight =
    db?.orders.filter(
      (o) => o.status === "new" || o.status === "in_kitchen" || o.status === "out_for_delivery"
    ).length ?? 0;

  return (
    <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-lg font-semibold tracking-tight text-white/95">
          {title}
        </div>
        {subtitle ? <div className="text-sm text-white/60">{subtitle}</div> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={activeCalls ? "info" : "neutral"}>Active calls: {activeCalls}</Badge>
        <Badge tone={inFlight ? "gold" : "neutral"}>In progress: {inFlight}</Badge>
        <Badge tone={openTickets ? "danger" : "neutral"}>Open tickets: {openTickets}</Badge>
        {onSimulateCall ? (
          <Button variant="primary" onClick={onSimulateCall}>
            Simulate inbound call
          </Button>
        ) : null}
      </div>
    </div>
  );
}
