"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { User } from "@/srcApp/entities/user/model/types/user";

type ContextValueType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

type ContextStorageType = {
  value: ContextValueType;
  subscribe: (listener: () => void) => () => void;
  notify: () => void;
};

export const AppContext = createContext<ContextStorageType | null>(null);

export const ContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(() => {
    return {
      user,
      setUser,
    };
  }, [user]);

  const storeRef = useRef<ContextStorageType | null>(null);

  storeRef.current = useMemo(() => {
    const listeners = new Set<() => void>();
    return {
      value,
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      notify: () => listeners.forEach((listener) => listener()),
    };
  }, []);

  useEffect(() => {
    if (!Object.is(storeRef.current?.value, value) && storeRef.current) {
      storeRef.current.value = value;
      storeRef.current.notify();
    }
  }, [value]);

  return (
    <AppContext.Provider value={storeRef.current}>
      {children}
    </AppContext.Provider>
  );
};

const useContextSelector = <T,>(
  selector: (value: ContextValueType) => T,
): T => {
  const store = useContext(AppContext);

  if (!store) {
    throw new Error(
      "useContextSelector must be used within a AppContext provider",
    );
  }

  return useSyncExternalStore(store.subscribe ?? (() => () => {}), () =>
    selector(store.value),
  );
};

export const useGetUser = () => {
  return useContextSelector((context) => {
    return context.user;
  });
};

export const useGetSetUser = () => {
  return useContextSelector((context) => {
    return context.setUser;
  });
};
