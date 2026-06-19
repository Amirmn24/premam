import type { HttpMethod, KeyValuePair } from "@/types/request";

export interface SavedRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  requests: SavedRequest[];
  createdAt: string;
  updatedAt: string;
}

export interface HistorySnapshot {
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: string;
}

export interface HistoryEntry {
  id: string;
  method: HttpMethod;
  url: string;
  status?: number;
  timestamp: string;
  snapshot: HistorySnapshot;
}

export interface TabsPersistence {
  version: 1;
  tabs: import("@/types/request").RequestTab[];
  activeTabId: string;
}

export interface CollectionExportFile {
  version: 1;
  type: "premam-collection";
  name: string;
  exportedAt: string;
  requests: Omit<SavedRequest, "id" | "createdAt">[];
}
