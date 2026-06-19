import type { RequestTab } from "@/types/request";
import type { HistorySnapshot, SavedRequest } from "@/types/storage";
import { createEmptyKeyValue } from "@/lib/keyValue";
import { createEmptyParam, createId } from "@/lib/url";
import type { BodyType } from "@/types/request";

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
    bodyType: "json",
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
    bodyType: "json",
  };
}

export function normalizeTab(tab: RequestTab): RequestTab {
  return {
    ...tab,
    bodyType: tab.bodyType ?? inferBodyType(tab),
  };
}

function inferBodyType(tab: RequestTab): BodyType {
  const contentType = tab.headers.find(
    (h) => h.enabled && h.key.trim().toLowerCase() === "content-type",
  )?.value;

  if (contentType?.toLowerCase().includes("application/json")) {
    return "json";
  }

  return "raw";
}

export function syncContentTypeHeader(
  headers: RequestTab["headers"],
  bodyType: BodyType,
): RequestTab["headers"] {
  const value =
    bodyType === "json" ? "application/json" : "text/plain";

  const index = headers.findIndex(
    (h) => h.key.trim().toLowerCase() === "content-type",
  );

  if (index === -1) {
    return [
      ...headers,
      { ...createEmptyKeyValue(), key: "Content-Type", value, enabled: true },
    ];
  }

  return headers.map((h, i) =>
    i === index ? { ...h, value, enabled: true } : h,
  );
}

export function tabToSnapshot(tab: RequestTab): HistorySnapshot {
  return {
    name: tab.name,
    method: tab.method,
    url: tab.url,
    params: tab.params,
    headers: tab.headers,
    body: tab.body,
    bodyType: tab.bodyType,
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
    bodyType: snapshot.bodyType ?? inferBodyTypeFromSnapshot(snapshot),
  };
}

function inferBodyTypeFromSnapshot(snapshot: HistorySnapshot): BodyType {
  const contentType = snapshot.headers.find(
    (h) => h.enabled && h.key.trim().toLowerCase() === "content-type",
  )?.value;

  return contentType?.toLowerCase().includes("application/json") ? "json" : "raw";
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
    bodyType: tab.bodyType,
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
