export const APP_CONFIG = {
  brand: {
    name: "Aurum",
    hotelName: "Aurum Grand London",
    accent: "#22c55e",
  },
  features: {
    enableMockAI: true,
    enableMockPOS: true,
  },
  security: {
    demoUsersEnabled: true,
  },
  providers: {
    llm: {
      type: (import.meta as any).env?.VITE_LLM_PROVIDER ?? "mock",
      apiBase: (import.meta as any).env?.VITE_LLM_API_BASE ?? "",
    },
    pos: {
      type: (import.meta as any).env?.VITE_POS_PROVIDER ?? "mock",
      oracleMicrosBase: (import.meta as any).env?.VITE_ORACLE_MICROS_BASE ?? "",
    },
  },
};
