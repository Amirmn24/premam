"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { HttpMethod, RequestTab } from "@/types/request";
import { createEmptyParam, createId } from "@/lib/url";
import { createEmptyKeyValue } from "@/lib/keyValue";

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "premam-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark =
      stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(prefersDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark, mounted]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ isDark, toggleTheme }),
    [isDark, toggleTheme],
  );

  if (!mounted) {
    return <div className="min-h-screen bg-surface" />;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

function createDefaultTab(index: number): RequestTab {
  return {
    id: createId(),
    name: `درخواست ${index}`,
    method: "GET",
    url: "",
    params: [createEmptyParam()],
    headers: [
      {
        ...createEmptyKeyValue(),
        key: "Content-Type",
        value: "application/json",
      },
    ],
    body: "",
  };
}

interface TabsContextValue {
  tabs: RequestTab[];
  activeTabId: string;
  activeTab: RequestTab;
  setActiveTabId: (id: string) => void;
  addTab: () => void;
  closeTab: (id: string) => void;
  updateActiveTab: (updates: Partial<RequestTab>) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<RequestTab[]>(() => [createDefaultTab(1)]);
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0].id);

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId],
  );

  const addTab = useCallback(() => {
    const newTab = createDefaultTab(tabs.length + 1);
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs.length]);

  const closeTab = useCallback(
    (id: string) => {
      if (tabs.length === 1) return;

      setTabs((prev) => {
        const filtered = prev.filter((t) => t.id !== id);
        if (activeTabId === id) {
          setActiveTabId(filtered[0].id);
        }
        return filtered;
      });
    },
    [tabs.length, activeTabId],
  );

  const updateActiveTab = useCallback(
    (updates: Partial<RequestTab>) => {
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId ? { ...tab, ...updates } : tab,
        ),
      );
    },
    [activeTabId],
  );

  const value = useMemo(
    () => ({
      tabs,
      activeTabId,
      activeTab,
      setActiveTabId,
      addTab,
      closeTab,
      updateActiveTab,
    }),
    [tabs, activeTabId, activeTab, addTab, closeTab, updateActiveTab],
  );

  return (
    <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within TabsProvider");
  }
  return context;
}

export function useActiveRequest() {
  const { activeTab, updateActiveTab } = useTabs();

  const setMethod = useCallback(
    (method: HttpMethod) => updateActiveTab({ method }),
    [updateActiveTab],
  );

  const setUrl = useCallback(
    (url: string) => updateActiveTab({ url }),
    [updateActiveTab],
  );

  const setParams = useCallback(
    (params: RequestTab["params"]) => updateActiveTab({ params }),
    [updateActiveTab],
  );

  const setHeaders = useCallback(
    (headers: RequestTab["headers"]) => updateActiveTab({ headers }),
    [updateActiveTab],
  );

  const setBody = useCallback(
    (body: string) => updateActiveTab({ body }),
    [updateActiveTab],
  );

  return {
    tab: activeTab,
    setMethod,
    setUrl,
    setParams,
    setHeaders,
    setBody,
  };
}
