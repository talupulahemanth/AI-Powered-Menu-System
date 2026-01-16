import type { CallSession, MenuItem, Order, RoomGuest, Ticket } from "@/lib/types";

function isoNowMinus(mins: number) {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

export const SEED_ROOMS: RoomGuest[] = Array.from({ length: 120 }).map((_, i) => {
  const room = String(100 + i);
  const names = [
    "Amelia Carter",
    "Omar Al‑Farsi",
    "Priya Sharma",
    "Li Wei",
    "Sofía Martínez",
    "Camille Dubois",
    "Dmitri Ivanov",
    "Noah Hughes",
    "Aisha Khan",
    "Hiro Tanaka",
  ];
  const langs = ["en", "ar", "hi", "zh", "es", "fr", "ru"] as const;
  const guestName = Math.random() > 0.15 ? names[i % names.length] : undefined;
  const preferredLanguage = langs[i % langs.length];
  const vip = i % 29 === 0;
  return { roomNumber: room, guestName, preferredLanguage, vip };
});

export const SEED_MENU: MenuItem[] = [
  {
    id: "ST01",
    category: "starters",
    name: "Isle of Mull Scallops, Cauliflower & Brown Butter",
    description:
      "Hand-dived scallops with caramelised cauliflower purée, capers, and lemon brown butter.",
    price: 18,
    prepMins: 14,
    dietary: [],
    allergens: ["molluscs", "milk"],
    available: true,
    updatedAt: isoNowMinus(55),
  },
  {
    id: "ST02",
    category: "starters",
    name: "Heritage Beetroot, Whipped Goat’s Curd & Pistachio",
    description:
      "Roasted heritage beetroot, citrus dressing, whipped goat’s curd, pistachio crumb.",
    price: 14,
    prepMins: 10,
    dietary: ["vegetarian"],
    allergens: ["milk", "tree-nuts"],
    available: true,
    updatedAt: isoNowMinus(42),
  },
  {
    id: "ST03",
    category: "starters",
    name: "Celeriac Velouté, Truffle & Chive Oil",
    description:
      "Silky celeriac soup with black truffle, chive oil and warm sourdough.",
    price: 13,
    prepMins: 9,
    dietary: ["vegetarian"],
    allergens: ["celery", "gluten", "milk"],
    available: true,
    updatedAt: isoNowMinus(33),
  },
  {
    id: "MN01",
    category: "mains",
    name: "Cornish Sea Bass, Fennel & Saffron Broth",
    description:
      "Crisp-skinned sea bass with shaved fennel, saffron broth and samphire.",
    price: 34,
    prepMins: 22,
    dietary: ["gluten-free"],
    allergens: ["fish"],
    available: true,
    updatedAt: isoNowMinus(20),
  },
  {
    id: "MN02",
    category: "mains",
    name: "Harissa Lamb Rump, Aubergine & Pomegranate",
    description:
      "Spiced lamb rump with smoked aubergine, pomegranate molasses and mint.",
    price: 38,
    prepMins: 26,
    dietary: ["halal"],
    allergens: [],
    available: true,
    updatedAt: isoNowMinus(18),
  },
  {
    id: "MN03",
    category: "mains",
    name: "Wild Mushroom & Barley Risotto",
    description:
      "Forest mushrooms, pearl barley, parmesan-style crisp, and herb butter.",
    price: 28,
    prepMins: 20,
    dietary: ["vegetarian"],
    allergens: ["gluten", "milk"],
    available: true,
    updatedAt: isoNowMinus(12),
  },
  {
    id: "MN04",
    category: "mains",
    name: "Charred Hispi Cabbage, Romesco & Hazelnut Gremolata",
    description:
      "Charred hispi cabbage with roasted pepper romesco and hazelnut gremolata.",
    price: 24,
    prepMins: 18,
    dietary: ["vegan"],
    allergens: ["tree-nuts"],
    available: true,
    updatedAt: isoNowMinus(9),
  },
  {
    id: "SD01",
    category: "sides",
    name: "Triple-Cooked Chips, Smoked Sea Salt",
    description: "Thick-cut triple-cooked chips with smoked sea salt.",
    price: 7,
    prepMins: 12,
    dietary: ["vegan", "gluten-free"],
    allergens: [],
    available: true,
    updatedAt: isoNowMinus(6),
  },
  {
    id: "SD02",
    category: "sides",
    name: "Tenderstem Broccoli, Chili & Lemon",
    description: "Charred tenderstem broccoli with chili flakes and lemon oil.",
    price: 8,
    prepMins: 8,
    dietary: ["vegan", "gluten-free"],
    allergens: [],
    available: true,
    updatedAt: isoNowMinus(6),
  },
  {
    id: "DS01",
    category: "desserts",
    name: "Dark Chocolate Delice, Olive Oil & Sea Salt",
    description:
      "Intense dark chocolate delice with Arbequina olive oil and Maldon sea salt.",
    price: 12,
    prepMins: 8,
    dietary: ["gluten-free"],
    allergens: ["milk", "eggs"],
    available: true,
    updatedAt: isoNowMinus(3),
  },
  {
    id: "DS02",
    category: "desserts",
    name: "Vanilla Panna Cotta, Winter Berries",
    description: "Madagascan vanilla panna cotta with macerated winter berries.",
    price: 11,
    prepMins: 7,
    dietary: ["gluten-free", "vegetarian"],
    allergens: ["milk"],
    available: true,
    updatedAt: isoNowMinus(3),
  },
  {
    id: "KD01",
    category: "kids",
    name: "Mini Roast Chicken, Buttered Peas",
    description: "Roast chicken with buttery peas and a small side of mash.",
    price: 14,
    prepMins: 18,
    dietary: [],
    allergens: ["milk"],
    available: true,
    updatedAt: isoNowMinus(15),
  },
  {
    id: "SF01",
    category: "soft_drinks",
    name: "Sparkling Water (750ml)",
    description: "Chilled sparkling mineral water.",
    price: 6,
    prepMins: 1,
    dietary: ["vegan", "gluten-free"],
    allergens: [],
    available: true,
    updatedAt: isoNowMinus(120),
  },
  {
    id: "AL01",
    category: "alcohol",
    name: "English Sparkling Wine (Glass)",
    description: "Crisp English sparkling wine with fine bubbles.",
    price: 16,
    prepMins: 1,
    dietary: ["gluten-free"],
    allergens: ["sulphites"],
    available: true,
    updatedAt: isoNowMinus(120),
  },
  {
    id: "LN01",
    category: "late_night",
    name: "Truffled Cheese Toastie",
    description: "Sourdough toastie with aged cheddar, truffle, and onion jam.",
    price: 15,
    prepMins: 10,
    dietary: ["vegetarian"],
    allergens: ["gluten", "milk"],
    available: true,
    updatedAt: isoNowMinus(2),
  },
];

// Expand menu to ~40 items by cloning variants with realistic metadata.
const extra: MenuItem[] = [];
const base = SEED_MENU.slice();
const categories: MenuItem["category"][] = [
  "starters",
  "mains",
  "sides",
  "desserts",
  "kids",
  "soft_drinks",
  "alcohol",
  "late_night",
];
for (let i = 0; i < 28; i++) {
  const src = base[i % base.length];
  const cat = categories[i % categories.length];
  extra.push({
    ...src,
    id: `${cat.toUpperCase().slice(0, 2)}X${String(i + 1).padStart(2, "0")}`,
    category: cat,
    name: `${src.name}${i % 3 === 0 ? " (Seasonal)" : i % 3 === 1 ? " (Chef’s Cut)" : ""}`.trim(),
    price: Math.max(6, Math.round((src.price + (i % 7) * 1.5) * 10) / 10),
    prepMins: Math.min(35, src.prepMins + (i % 6)),
    updatedAt: isoNowMinus(5 + i * 2),
  });
}
export const MENU: MenuItem[] = [...SEED_MENU, ...extra].slice(0, 42);

export const CALLS: CallSession[] = Array.from({ length: 12 }).map((_, i) => {
  const room = SEED_ROOMS[(i * 7) % SEED_ROOMS.length];
  const statuses = ["browsing", "ordering", "confirming", "escalated"] as const;
  return {
    id: `CALL-${1000 + i}`,
    startedAt: isoNowMinus(20 - i),
    durationSec: 60 * (2 + i),
    roomNumber: i % 5 === 0 ? undefined : room.roomNumber,
    guestName: i % 4 === 0 ? undefined : room.guestName,
    language: room.preferredLanguage ?? "en",
    status: statuses[i % statuses.length],
    agent: `Agent ${String.fromCharCode(65 + (i % 10))}`,
    transcriptSnippet:
      i % 3 === 0
        ? "Guest asked: ‘What’s safe if I’m allergic to nuts and shellfish?’"
        : i % 3 === 1
          ? "Guest: ‘Could you recommend something halal and dairy-free?’"
          : "Guest: ‘Please deliver at 19:30, and sauce on the side.’",
    currentOrderDraft: {
      items: [{ itemId: MENU[i % MENU.length]!.id, qty: 1 + (i % 2), modifiers: ["sauce on side"] }],
      notes: i % 3 === 0 ? "Allergy check required" : undefined,
      schedule: i % 2 === 0 ? "asap" : { at: new Date(Date.now() + 35 * 60_000).toISOString() },
    },
  };
});

export const ORDERS: Order[] = Array.from({ length: 22 }).map((_, i) => {
  const room = SEED_ROOMS[(i * 5) % SEED_ROOMS.length];
  const itemA = MENU[(i * 3) % MENU.length]!;
  const itemB = MENU[(i * 3 + 4) % MENU.length]!;
  const items = [
    { itemId: itemA.id, name: itemA.name, qty: 1, modifiers: ["no nuts"], price: itemA.price },
    { itemId: itemB.id, name: itemB.name, qty: 1 + (i % 2), modifiers: [], price: itemB.price },
  ];
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const serviceCharge = Math.round(subtotal * 0.1 * 100) / 100;
  const tax = Math.round((subtotal + serviceCharge) * 0.2 * 100) / 100;
  const total = Math.round((subtotal + serviceCharge + tax) * 100) / 100;
  const statuses = ["new", "in_kitchen", "out_for_delivery", "delivered", "cancelled"] as const;
  const dietaryFlags = Array.from(new Set([...itemA.dietary, ...itemB.dietary]));
  const allergenFlags = Array.from(new Set([...itemA.allergens, ...itemB.allergens]));
  return {
    id: `ORD-${5000 + i}`,
    createdAt: isoNowMinus(180 - i * 7),
    roomNumber: room.roomNumber,
    guestName: room.guestName,
    language: room.preferredLanguage ?? "en",
    status: statuses[i % statuses.length],
    etaMins: 25 + (i % 20),
    items,
    dietaryFlags,
    allergenFlags,
    subtotal,
    serviceCharge,
    tax,
    total,
    posProvider: i % 4 === 0 ? "oracle_micros" : "mock",
  };
});

export const TICKETS: Ticket[] = Array.from({ length: 12 }).map((_, i) => {
  const room = SEED_ROOMS[(i * 9) % SEED_ROOMS.length];
  const urgencies = ["low", "medium", "high", "critical"] as const;
  const cats = ["allergy_risk", "vip", "complaint", "handover", "anomaly"] as const;
  return {
    id: `TCK-${8000 + i}`,
    createdAt: isoNowMinus(240 - i * 13),
    roomNumber: i % 5 === 0 ? undefined : room.roomNumber,
    guestName: room.guestName,
    language: room.preferredLanguage ?? "en",
    urgency: urgencies[i % urgencies.length],
    category: cats[i % cats.length],
    summary:
      i % 3 === 0
        ? "Potential allergy risk: guest requested ‘nut-free’ but selected pistachio item. Needs confirmation."
        : i % 3 === 1
          ? "VIP guest requested expedited delivery and bespoke modifications."
          : "Complaint detected: repeated delays mentioned; recommend manager follow-up.",
    transcriptSnippet:
      "…I’m severely allergic to peanuts and shellfish—can you guarantee it’s safe?…",
    status: i % 4 === 0 ? "acknowledged" : "open",
  };
});
