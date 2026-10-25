import { createContext, ReactNode, useContext, useState } from "react";
function useAppState() {
  const [ids, setIds] = useState<string[]>([]);
  const [notify, setNotify] = useState(true);
  const [dark, setDark] = useState(false);
  return {
    ids,
    notify,
    setNotify,
    dark,
    setDark,
    toggle: (id: string) =>
      setIds((old) =>
        old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
      ),
  };
}
const Context = createContext<ReturnType<typeof useAppState> | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const value = useAppState();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAppStateContext() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing AppProvider");
  return value;
}
