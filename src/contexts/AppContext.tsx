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
import type { RequestTab } from "@/types/request";
import type { Collection, HistoryEntry } from "@/types/storage";
import {
  loadCollections,
  loadHistory,
  loadTabsState,
  saveCollections,
  saveHistory,
  saveTabsState,
} from "@/lib/storage";
import {
  createDefaultTab,
  resetTabValues,
  snapshotToTab,
  tabToSavedRequest,
} from "@/lib/requestFactory";
import { createId } from "@/lib/url";

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
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
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

interface TabsContextValue {
  tabs: RequestTab[];
  activeTabId: string;
  activeTab: RequestTab;
  mounted: boolean;
  setActiveTabId: (id: string) => void;
  addTab: (initial?: Partial<RequestTab>) => void;
  closeTab: (id: string) => void;
  updateActiveTab: (updates: Partial<RequestTab>) => void;
  resetActiveTab: () => void;
  loadSnapshotIntoActiveTab: (snapshot: RequestTab | import("@/types/storage").HistorySnapshot) => void;
  loadSnapshotIntoNewTab: (snapshot: import("@/types/storage").HistorySnapshot) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [tabs, setTabs] = useState<RequestTab[]>(() => [createDefaultTab(1)]);
  const [activeTabId, setActiveTabId] = useState<string>("");

  useEffect(() => {
    const stored = loadTabsState();
    setTabs(stored.tabs);
    setActiveTabId(stored.activeTabId);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !activeTabId) return;
    saveTabsState(tabs, activeTabId);
  }, [tabs, activeTabId, mounted]);

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId],
  );

  const addTab = useCallback(
    (initial?: Partial<RequestTab>) => {
      const newTab = { ...createDefaultTab(tabs.length + 1), ...initial };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    },
    [tabs.length],
  );

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

  const resetActiveTab = useCallback(() => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? resetTabValues(tab) : tab,
      ),
    );
  }, [activeTabId]);

  const loadSnapshotIntoActiveTab = useCallback(
    (snapshot: RequestTab | import("@/types/storage").HistorySnapshot) => {
      const isFullTab = "id" in snapshot && "params" in snapshot;

      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;

          if (isFullTab) {
            return { ...(snapshot as RequestTab), id: tab.id };
          }

          return {
            ...snapshotToTab(snapshot, tabs.length, tab.id),
          };
        }),
      );
    },
    [activeTabId, tabs.length],
  );

  const loadSnapshotIntoNewTab = useCallback(
    (snapshot: import("@/types/storage").HistorySnapshot) => {
      const newTab = snapshotToTab(snapshot, tabs.length + 1);
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    },
    [tabs.length],
  );

  const value = useMemo(
    () => ({
      tabs,
      activeTabId,
      activeTab,
      mounted,
      setActiveTabId,
      addTab,
      closeTab,
      updateActiveTab,
      resetActiveTab,
      loadSnapshotIntoActiveTab,
      loadSnapshotIntoNewTab,
    }),
    [
      tabs,
      activeTabId,
      activeTab,
      mounted,
      addTab,
      closeTab,
      updateActiveTab,
      resetActiveTab,
      loadSnapshotIntoActiveTab,
      loadSnapshotIntoNewTab,
    ],
  );

  if (!mounted) {
    return <div className="min-h-screen bg-surface" />;
  }

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
    (method: RequestTab["method"]) => updateActiveTab({ method }),
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

interface CollectionsContextValue {
  collections: Collection[];
  createCollection: (name: string) => void;
  deleteCollection: (id: string) => void;
  renameCollection: (id: string, name: string) => void;
  saveCurrentToCollection: (collectionId: string, tab: RequestTab, name?: string) => void;
  loadRequestFromCollection: (collectionId: string, requestId: string, mode: "current" | "new") => void;
  deleteRequestFromCollection: (collectionId: string, requestId: string) => void;
  importCollection: (collection: Collection) => void;
}

const CollectionsContext = createContext<CollectionsContextValue | null>(null);

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [mounted, setMounted] = useState(false);
  const { loadSnapshotIntoActiveTab, loadSnapshotIntoNewTab } = useTabs();

  useEffect(() => {
    setCollections(loadCollections());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveCollections(collections);
  }, [collections, mounted]);

  const createCollection = useCallback((name: string) => {
    const now = new Date().toISOString();
    const collection: Collection = {
      id: createId(),
      name: name.trim() || "مجموعه جدید",
      requests: [],
      createdAt: now,
      updatedAt: now,
    };
    setCollections((prev) => [...prev, collection]);
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const renameCollection = useCallback((id: string, name: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, name: name.trim() || c.name, updatedAt: new Date().toISOString() }
          : c,
      ),
    );
  }, []);

  const saveCurrentToCollection = useCallback(
    (collectionId: string, tab: RequestTab, name?: string) => {
      const saved = tabToSavedRequest(tab, name);
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                requests: [...c.requests, saved],
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
    },
    [],
  );

  const loadRequestFromCollection = useCallback(
    (collectionId: string, requestId: string, mode: "current" | "new") => {
      const collection = collections.find((c) => c.id === collectionId);
      const request = collection?.requests.find((r) => r.id === requestId);
      if (!request) return;

      const snapshot = {
        name: request.name,
        method: request.method,
        url: request.url,
        params: request.params,
        headers: request.headers,
        body: request.body,
      };

      if (mode === "new") {
        loadSnapshotIntoNewTab(snapshot);
      } else {
        loadSnapshotIntoActiveTab(snapshot);
      }
    },
    [collections, loadSnapshotIntoActiveTab, loadSnapshotIntoNewTab],
  );

  const deleteRequestFromCollection = useCallback(
    (collectionId: string, requestId: string) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                requests: c.requests.filter((r) => r.id !== requestId),
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
    },
    [],
  );

  const importCollection = useCallback((collection: Collection) => {
    setCollections((prev) => [...prev, collection]);
  }, []);

  const value = useMemo(
    () => ({
      collections,
      createCollection,
      deleteCollection,
      renameCollection,
      saveCurrentToCollection,
      loadRequestFromCollection,
      deleteRequestFromCollection,
      importCollection,
    }),
    [
      collections,
      createCollection,
      deleteCollection,
      renameCollection,
      saveCurrentToCollection,
      loadRequestFromCollection,
      deleteRequestFromCollection,
      importCollection,
    ],
  );

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollections must be used within CollectionsProvider");
  }
  return context;
}

interface HistoryContextValue {
  history: HistoryEntry[];
  addHistoryEntry: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  clearHistory: () => void;
  loadFromHistory: (id: string, mode: "current" | "new") => void;
  removeHistoryEntry: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const { loadSnapshotIntoActiveTab, loadSnapshotIntoNewTab } = useTabs();

  useEffect(() => {
    setHistory(loadHistory());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveHistory(history);
  }, [history, mounted]);

  const addHistoryEntry = useCallback(
    (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: createId(),
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => [newEntry, ...prev.filter((h) => h.url !== entry.url || h.method !== entry.method)].slice(0, 99));
    },
    [],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const loadFromHistory = useCallback(
    (id: string, mode: "current" | "new") => {
      const entry = history.find((h) => h.id === id);
      if (!entry) return;

      if (mode === "new") {
        loadSnapshotIntoNewTab(entry.snapshot);
      } else {
        loadSnapshotIntoActiveTab(entry.snapshot);
      }
    },
    [history, loadSnapshotIntoActiveTab, loadSnapshotIntoNewTab],
  );

  const removeHistoryEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      history,
      addHistoryEntry,
      clearHistory,
      loadFromHistory,
      removeHistoryEntry,
    }),
    [history, addHistoryEntry, clearHistory, loadFromHistory, removeHistoryEntry],
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within HistoryProvider");
  }
  return context;
}
