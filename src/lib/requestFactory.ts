import type { RequestTab } from "@/types/request";
import type { HistorySnapshot, SavedRequest } from "@/types/storage";
import { createEmptyKeyValue } from "@/lib/keyValue";
import { createEmptyParam, createId } from "@/lib/url";

export function createDefaultHeaders() {
  return [
    {
      ...createEmptyKeyValue(),
      key: "Content-Type",
      value: "application/json",
    },
  ];
}

export function createDefaultTab(index: number, id?: string): RequestTab {
  return {
    id: id ?? createId(),
    name: `درخواست ${index}`,
    method: "GET",
    url: "",
    params: [createEmptyParam()],
    headers: createDefaultHeaders(),
    body: "",
  };
}

export function resetTabValues(tab: RequestTab): RequestTab {
  return {
    ...tab,
    method: "GET",
    url: "",
    params: [createEmptyParam()],
    headers: createDefaultHeaders(),
    body: "",
  };
}

export function tabToSnapshot(tab: RequestTab): HistorySnapshot {
  return {
    name: tab.name,
    method: tab.method,
    url: tab.url,
    params: tab.params,
    headers: tab.headers,
    body: tab.body,
  };
}

export function snapshotToTab(
  snapshot: HistorySnapshot,
  index: number,
  id?: string,
): RequestTab {
  return {
    id: id ?? createId(),
    name: snapshot.name || `درخواست ${index}`,
    method: snapshot.method,
    url: snapshot.url,
    params: snapshot.params.length > 0 ? snapshot.params : [createEmptyParam()],
    headers:
      snapshot.headers.length > 0 ? snapshot.headers : createDefaultHeaders(),
    body: snapshot.body,
  };
}

export function tabToSavedRequest(tab: RequestTab, name?: string): SavedRequest {
  return {
    id: createId(),
    name: name ?? tab.name,
    method: tab.method,
    url: tab.url,
    params: tab.params,
    headers: tab.headers,
    body: tab.body,
    createdAt: new Date().toISOString(),
  };
}

export function savedRequestToTab(
  request: SavedRequest,
  index: number,
  id?: string,
): RequestTab {
  return snapshotToTab(request, index, id);
}
