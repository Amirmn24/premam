import type { RequestTab } from "@/types/request";
import type { Collection, HistoryEntry, TabsPersistence } from "@/types/storage";
import { createDefaultTab, normalizeTab } from "@/lib/requestFactory";

export const STORAGE_KEYS = {
  TABS: "premam-tabs",
  COLLECTIONS: "premam-collections",
  HISTORY: "premam-history",
} as const;

const MAX_HISTORY_ENTRIES = 100;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string): T | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadTabsState(): { tabs: RequestTab[]; activeTabId: string } {
  const stored = readJson<TabsPersistence>(STORAGE_KEYS.TABS);

  if (!stored?.tabs?.length) {
    const defaultTab = createDefaultTab(1);
    return { tabs: [defaultTab], activeTabId: defaultTab.id };
  }

  const activeTabId = stored.tabs.some((t) => t.id === stored.activeTabId)
    ? stored.activeTabId
    : stored.tabs[0].id;

  return { tabs: stored.tabs.map(normalizeTab), activeTabId };
}

export function saveTabsState(tabs: RequestTab[], activeTabId: string): void {
  const payload: TabsPersistence = {
    version: 1,
    tabs,
    activeTabId,
  };
  writeJson(STORAGE_KEYS.TABS, payload);
}

export function loadCollections(): Collection[] {
  return readJson<Collection[]>(STORAGE_KEYS.COLLECTIONS) ?? [];
}

export function saveCollections(collections: Collection[]): void {
  writeJson(STORAGE_KEYS.COLLECTIONS, collections);
}

export function loadHistory(): HistoryEntry[] {
  return readJson<HistoryEntry[]>(STORAGE_KEYS.HISTORY) ?? [];
}

export function saveHistory(history: HistoryEntry[]): void {
  writeJson(
    STORAGE_KEYS.HISTORY,
    history.slice(0, MAX_HISTORY_ENTRIES),
  );
}
