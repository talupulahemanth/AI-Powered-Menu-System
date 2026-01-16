import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { DB, } from "@/lib/mockServer";
import { api, mockBus } from "@/lib/mockServer";
import type { Role } from "@/lib/types";

type AuthUser = { username: string; role: Role; token: string };

type Store = {
  db: DB | null;
  auth: AuthUser | null;
  login: (username: string, role: Role) => void;
  logout: () => void;
  refresh: () => Promise<void>;
};

const StoreCtx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB | null>(null);
  const [auth, setAuth] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("aurum_auth");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  async function refresh() {
    const snap = await api.getSnapshot();
    setDb(snap);
  }

  useEffect(() => {
    refresh();
    const unsub = mockBus.subscribe(() => {
      refresh();
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function login(username: string, role: Role) {
    const token = `demo.${btoa(JSON.stringify({ u: username, r: role }))}.token`;
    const user: AuthUser = { username, role, token };
    setAuth(user);
    localStorage.setItem("aurum_auth", JSON.stringify(user));
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem("aurum_auth");
  }

  const value = useMemo<Store>(
    () => ({ db, auth, login, logout, refresh }),
    [db, auth]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("StoreProvider missing");
  return ctx;
}
