import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { fetchPhone } from "../api/phoneApi";
import { PHONES } from "../data/phones";
import type { Phone } from "../types";

type LoadPhone = (mode: string, reload?: boolean) => Promise<Phone>;
const PhoneSessionContext = createContext<LoadPhone | null>(null);

// A session belongs to the Select Phone stack. Both screens share its snapshot;
// leaving the lesson disposes it so reopening Bài 2 fetches fresh API data.
export function PhoneSessionProvider({ children }: { children: ReactNode }) {
  const cache = useRef(new Map<string, Promise<Phone>>());
  const requests = useRef(new Set<AbortController>());
  useEffect(() => {
    const activeRequests = requests.current;
    return () => {
      for (const controller of activeRequests) controller.abort();
    };
  }, []);
  const loadPhone = useCallback<LoadPhone>((mode, reload = false) => {
    if (mode !== "api") return Promise.resolve(PHONES[0]);
    const existing = cache.current.get(mode);
    if (existing && !reload) return existing;
    const controller = new AbortController();
    requests.current.add(controller);
    const timer = setTimeout(() => controller.abort(), 15000);
    const result = fetchPhone("1", controller.signal).finally(() => {
      clearTimeout(timer);
      requests.current.delete(controller);
    });
    cache.current.set(mode, result);
    return result;
  }, []);
  return (
    <PhoneSessionContext.Provider value={loadPhone}>
      {children}
    </PhoneSessionContext.Provider>
  );
}

export function usePhoneSession() {
  const value = useContext(PhoneSessionContext);
  if (!value) throw new Error("Missing PhoneSessionProvider");
  return value;
}
