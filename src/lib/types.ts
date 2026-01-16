export type Role = "admin" | "supervisor" | "staff";

export type LanguageCode =
  | "en"
  | "ar"
  | "hi"
  | "zh"
  | "es"
  | "fr"
  | "ru";

export type DietaryTag =
  | "vegan"
  | "vegetarian"
  | "halal"
  | "kosher"
  | "gluten-free"
  | "dairy-free"
  | "nut-free"
  | "shellfish-free";

export type Allergen =
  | "gluten"
  | "milk"
  | "eggs"
  | "fish"
  | "crustaceans"
  | "molluscs"
  | "peanuts"
  | "tree-nuts"
  | "soy"
  | "sesame"
  | "celery"
  | "mustard"
  | "sulphites"
  | "lupin";

export type CallStatus =
  | "browsing"
  | "ordering"
  | "confirming"
  | "escalated"
  | "ended";

export type OrderStatus =
  | "new"
  | "in_kitchen"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Urgency = "low" | "medium" | "high" | "critical";

export interface RoomGuest {
  roomNumber: string;
  guestName?: string;
  preferredLanguage?: LanguageCode;
  vip?: boolean;
}

export interface MenuItem {
  id: string;
  category:
    | "starters"
    | "mains"
    | "sides"
    | "desserts"
    | "kids"
    | "soft_drinks"
    | "alcohol"
    | "late_night";
  name: string;
  description: string;
  price: number;
  prepMins: number;
  dietary: DietaryTag[];
  allergens: Allergen[];
  available: boolean;
  updatedAt: string;
}

export interface CallSession {
  id: string;
  startedAt: string;
  durationSec: number;
  roomNumber?: string;
  guestName?: string;
  language: LanguageCode;
  status: CallStatus;
  agent: string;
  transcriptSnippet: string;
  currentOrderDraft?: {
    items: Array<{ itemId: string; qty: number; modifiers: string[] }>;
    notes?: string;
    schedule?: "asap" | { at: string };
  };
}

export interface Order {
  id: string;
  createdAt: string;
  roomNumber: string;
  guestName?: string;
  language: LanguageCode;
  status: OrderStatus;
  etaMins: number;
  items: Array<{ itemId: string; name: string; qty: number; modifiers: string[]; price: number }>;
  dietaryFlags: DietaryTag[];
  allergenFlags: Allergen[];
  subtotal: number;
  serviceCharge: number;
  tax: number;
  total: number;
  posProvider: "oracle_micros" | "mock";
}

export interface Ticket {
  id: string;
  createdAt: string;
  roomNumber?: string;
  guestName?: string;
  language: LanguageCode;
  urgency: Urgency;
  category: "allergy_risk" | "vip" | "complaint" | "handover" | "anomaly";
  summary: string;
  transcriptSnippet: string;
  status: "open" | "acknowledged" | "resolved";
}

export interface KPI {
  label: string;
  value: string;
  delta?: string;
}
