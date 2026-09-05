"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { CaseStatus, CropCase, CropInsurance, Lang } from "../types";
import { SEED_CASES } from "../mock/cases";
import { UI, type UIStrings } from "../i18n/ui";

interface State {
  lang: Lang;
  loggedIn: boolean;
  farmerName: string;
  cases: CropCase[];
  ackAlerts: string[];
  insurance: CropInsurance | null;
  insuranceSkipped: boolean;
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; state: Partial<State> }
  | { type: "setLang"; lang: Lang }
  | { type: "login"; name?: string }
  | { type: "logout" }
  | { type: "addCase"; c: CropCase }
  | { type: "updateCase"; id: string; patch: Partial<CropCase> }
  | { type: "addFollowUp"; id: string; note: string; improved: boolean }
  | { type: "ackAlert"; id: string }
  | { type: "setInsurance"; insurance: CropInsurance | null }
  | { type: "skipInsurance" }
  | { type: "reset" };

const initial: State = { lang: "mr", loggedIn: false, farmerName: "Ramesh Patil", cases: SEED_CASES, ackAlerts: [], insurance: null, insuranceSkipped: false, hydrated: false };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "hydrate": return { ...s, ...a.state, hydrated: true };
    case "setLang": return { ...s, lang: a.lang };
    case "login": return { ...s, loggedIn: true, farmerName: a.name ?? s.farmerName };
    case "logout": return { ...s, loggedIn: false };
    case "addCase": return { ...s, cases: [a.c, ...s.cases.filter((c) => c.id !== a.c.id)] };
    case "updateCase": return { ...s, cases: s.cases.map((c) => (c.id === a.id ? { ...c, ...a.patch, updatedAt: new Date().toISOString() } : c)) };
    case "addFollowUp": return { ...s, cases: s.cases.map((c) => (c.id === a.id ? { ...c, followUps: [...c.followUps, { date: new Date().toISOString().slice(0, 10), note: a.note, improved: a.improved }] } : c)) };
    case "ackAlert": return { ...s, ackAlerts: [...new Set([...s.ackAlerts, a.id])] };
    case "setInsurance": return { ...s, insurance: a.insurance, insuranceSkipped: a.insurance ? false : s.insuranceSkipped };
    case "skipInsurance": return { ...s, insuranceSkipped: true };
    case "reset": return { ...initial, hydrated: true, lang: s.lang, loggedIn: s.loggedIn, farmerName: s.farmerName };
    default: return s;
  }
}

interface Ctx extends State {
  t: UIStrings;
  setLang: (l: Lang) => void;
  login: (name?: string) => void;
  logout: () => void;
  addCase: (c: CropCase) => void;
  updateCase: (id: string, patch: Partial<CropCase>) => void;
  setStatus: (id: string, status: CaseStatus, extra?: Partial<CropCase>) => void;
  addFollowUp: (id: string, note: string, improved: boolean) => void;
  ackAlert: (id: string) => void;
  setInsurance: (insurance: CropInsurance | null) => void;
  skipInsurance: () => void;
  reset: () => void;
}

const AppCtx = createContext<Ctx | null>(null);
const KEY = "mh-crophealth-v1";

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        const seedIds = new Set(SEED_CASES.map((c) => c.id));
        const farmerCases = (parsed.cases ?? []).filter((c) => c.source === "farmer");
        const patchedSeeds = SEED_CASES.map((seed) => (parsed.cases ?? []).find((c) => c.id === seed.id) ?? seed);
        dispatch({ type: "hydrate", state: { ...parsed, cases: [...farmerCases.filter((c) => !seedIds.has(c.id)), ...patchedSeeds] } });
      } else {
        dispatch({ type: "hydrate", state: {} });
      }
    } catch {
      dispatch({ type: "hydrate", state: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const { hydrated: _h, ...rest } = state;
      void _h;
      localStorage.setItem(KEY, JSON.stringify(rest));
    } catch {}
  }, [state]);

  const setLang = useCallback((lang: Lang) => dispatch({ type: "setLang", lang }), []);
  const login = useCallback((name?: string) => dispatch({ type: "login", name }), []);
  const logout = useCallback(() => dispatch({ type: "logout" }), []);
  const addCase = useCallback((c: CropCase) => dispatch({ type: "addCase", c }), []);
  const updateCase = useCallback((id: string, patch: Partial<CropCase>) => dispatch({ type: "updateCase", id, patch }), []);
  const setStatus = useCallback((id: string, status: CaseStatus, extra?: Partial<CropCase>) => dispatch({ type: "updateCase", id, patch: { status, ...extra } }), []);
  const addFollowUp = useCallback((id: string, note: string, improved: boolean) => dispatch({ type: "addFollowUp", id, note, improved }), []);
  const ackAlert = useCallback((id: string) => dispatch({ type: "ackAlert", id }), []);
  const setInsurance = useCallback((insurance: CropInsurance | null) => dispatch({ type: "setInsurance", insurance }), []);
  const skipInsurance = useCallback(() => dispatch({ type: "skipInsurance" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo<Ctx>(() => ({ ...state, t: UI[state.lang], setLang, login, logout, addCase, updateCase, setStatus, addFollowUp, ackAlert, setInsurance, skipInsurance, reset }), [state, setLang, login, logout, addCase, updateCase, setStatus, addFollowUp, ackAlert, setInsurance, skipInsurance, reset]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}

export function useCases() {
  return useApp().cases;
}
