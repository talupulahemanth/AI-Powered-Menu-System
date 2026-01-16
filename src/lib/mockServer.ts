import type { CallSession, MenuItem, Order, Ticket } from "@/lib/types";
import { CALLS, MENU, ORDERS, TICKETS } from "@/lib/seed";

type Listener = () => void;

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16)}`;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export type DB = {
  menu: MenuItem[];
  calls: CallSession[];
  orders: Order[];
  tickets: Ticket[];
};

const db: DB = {
  menu: MENU,
  calls: CALLS,
  orders: ORDERS,
  tickets: TICKETS,
};

const listeners = new Set<Listener>();

export const mockBus = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit() {
    for (const fn of listeners) fn();
  },
};

export const api = {
  async getSnapshot() {
    return structuredClone(db);
  },
  async updateCall(id: string, patch: Partial<CallSession>) {
    const idx = db.calls.findIndex((c) => c.id === id);
    if (idx >= 0) db.calls[idx] = { ...db.calls[idx]!, ...patch };
    mockBus.emit();
    return db.calls[idx]!;
  },
  async whisperToAgent(callId: string, message: string) {
    // In real implementation: push to agent routing / tool context.
    void message;
    return api.updateCall(callId, {
      transcriptSnippet: "Supervisor whisper delivered to AI agent.",
    });
  },
  async createTicket(fromCallId: string, overrides?: Partial<Ticket>) {
    const call = db.calls.find((c) => c.id === fromCallId);
    const t: Ticket = {
      id: uid("TCK"),
      createdAt: new Date().toISOString(),
      roomNumber: call?.roomNumber,
      guestName: call?.guestName,
      language: call?.language ?? "en",
      urgency: "high",
      category: "handover",
      summary: "Supervisor escalation requested from Live Calls view.",
      transcriptSnippet: call?.transcriptSnippet ?? "",
      status: "open",
      ...overrides,
    };
    db.tickets = [t, ...db.tickets];
    mockBus.emit();
    return t;
  },
  async updateTicket(id: string, patch: Partial<Ticket>) {
    const idx = db.tickets.findIndex((t) => t.id === id);
    if (idx >= 0) db.tickets[idx] = { ...db.tickets[idx]!, ...patch };
    mockBus.emit();
    return db.tickets[idx]!;
  },
  async updateOrder(id: string, patch: Partial<Order>) {
    const idx = db.orders.findIndex((o) => o.id === id);
    if (idx >= 0) db.orders[idx] = { ...db.orders[idx]!, ...patch };
    mockBus.emit();
    return db.orders[idx]!;
  },
  async updateMenuItem(id: string, patch: Partial<MenuItem>) {
    const idx = db.menu.findIndex((m) => m.id === id);
    if (idx >= 0)
      db.menu[idx] = {
        ...db.menu[idx]!,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
    mockBus.emit();
    return db.menu[idx]!;
  },
  async exportMenu() {
    return JSON.stringify(db.menu, null, 2);
  },
  async importMenu(json: string) {
    const parsed = JSON.parse(json) as MenuItem[];
    db.menu = parsed.map((m) => ({ ...m, updatedAt: new Date().toISOString() }));
    mockBus.emit();
    return db.menu;
  },
  // Mock "AI" call simulator: create call, then create order/ticket.
  async simulateInboundCall(roomNumber?: string) {
    const call: CallSession = {
      id: uid("CALL"),
      startedAt: new Date().toISOString(),
      durationSec: 0,
      roomNumber,
      guestName: undefined,
      language: "en",
      status: "browsing",
      agent: `Agent ${String.fromCharCode(65 + (db.calls.length % 10))}`,
      transcriptSnippet: "Incoming call connected. AI greeting in progress…",
      currentOrderDraft: { items: [], schedule: "asap" },
    };
    db.calls = [call, ...db.calls];
    mockBus.emit();

    // After a short delay, move through states and post an order.
    setTimeout(() => {
      api.updateCall(call.id, {
        status: "ordering",
        transcriptSnippet: "Guest: ‘I’d like two mains, one halal and one vegetarian.’",
      });
    }, 900);

    setTimeout(() => {
      const items = [db.menu.find((m) => m.dietary.includes("halal"))!, db.menu.find((m) => m.dietary.includes("vegetarian"))!]
        .filter(Boolean)
        .slice(0, 2);
      const mapped = items.map((m) => ({
        itemId: m.id,
        name: m.name,
        qty: 1,
        modifiers: [],
        price: m.price,
      }));
      const subtotal = mapped.reduce((s, it) => s + it.price * it.qty, 0);
      const serviceCharge = Math.round(subtotal * 0.1 * 100) / 100;
      const tax = Math.round((subtotal + serviceCharge) * 0.2 * 100) / 100;
      const total = Math.round((subtotal + serviceCharge + tax) * 100) / 100;
      const dietaryFlags = uniq(items.flatMap((m) => m.dietary));
      const allergenFlags = uniq(items.flatMap((m) => m.allergens));

      const order: Order = {
        id: uid("ORD"),
        createdAt: new Date().toISOString(),
        roomNumber: roomNumber ?? "TBD",
        guestName: undefined,
        language: "en",
        status: "new",
        etaMins: 35,
        items: mapped,
        dietaryFlags,
        allergenFlags,
        subtotal,
        serviceCharge,
        tax,
        total,
        posProvider: "mock",
      };
      db.orders = [order, ...db.orders];
      api.updateCall(call.id, {
        status: "confirming",
        transcriptSnippet: `AI summary: ‘Total £${total.toFixed(2)}. ETA ~35 minutes. May I confirm?’`,
        currentOrderDraft: {
          items: mapped.map((i) => ({ itemId: i.itemId, qty: i.qty, modifiers: i.modifiers })),
          schedule: "asap",
        },
      });
      mockBus.emit();
    }, 1800);

    setTimeout(() => {
      api.updateCall(call.id, {
        status: "ended",
        transcriptSnippet: "Call ended. Order confirmed and sent to POS.",
        durationSec: 190,
      });
    }, 3200);

    return call;
  },
};
