import type { Collection, CollectionExportFile, SavedRequest } from "@/types/storage";
import { createId } from "@/lib/url";

export function exportCollectionToJson(collection: Collection): string {
  const payload: CollectionExportFile = {
    version: 1,
    type: "premam-collection",
    name: collection.name,
    exportedAt: new Date().toISOString(),
    requests: collection.requests.map(({ name, method, url, params, headers, body }) => ({
      name,
      method,
      url,
      params,
      headers,
      body,
    })),
  };

  return JSON.stringify(payload, null, 2);
}

export function downloadCollectionFile(collection: Collection): void {
  const json = exportCollectionToJson(collection);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${collection.name.replace(/\s+/g, "-").toLowerCase()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function isValidExportFile(data: unknown): data is CollectionExportFile {
  if (!data || typeof data !== "object") return false;

  const file = data as CollectionExportFile;

  return (
    file.version === 1 &&
    file.type === "premam-collection" &&
    typeof file.name === "string" &&
    Array.isArray(file.requests)
  );
}

export function parseImportedCollection(
  json: string,
): { ok: true; collection: Collection } | { ok: false; error: string } {
  try {
    const parsed: unknown = JSON.parse(json);

    if (!isValidExportFile(parsed)) {
      return {
        ok: false,
        error: "فرمت فایل مجموعه معتبر نیست.",
      };
    }

    const now = new Date().toISOString();

    const collection: Collection = {
      id: createId(),
      name: parsed.name,
      createdAt: now,
      updatedAt: now,
      requests: parsed.requests.map((request) => ({
        id: createId(),
        name: request.name || "درخواست بدون نام",
        method: request.method,
        url: request.url ?? "",
        params: Array.isArray(request.params) ? request.params : [],
        headers: Array.isArray(request.headers) ? request.headers : [],
        body: request.body ?? "",
        createdAt: now,
      })),
    };

    return { ok: true, collection };
  } catch {
    return {
      ok: false,
      error: "فایل JSON قابل خواندن نیست.",
    };
  }
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("خطا در خواندن فایل"));
    reader.readAsText(file);
  });
}
