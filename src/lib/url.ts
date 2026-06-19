import type { KeyValuePair, UrlValidationResult } from "@/types/request";

export function createId(): string {
  return crypto.randomUUID();
}

export function createEmptyParam(): KeyValuePair {
  return { id: createId(), key: "", value: "", enabled: true };
}

export function validateUrl(url: string): UrlValidationResult {
  const trimmed = url.trim();

  if (!trimmed) {
    return { valid: false, error: "آدرس URL نمی‌تواند خالی باشد." };
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        valid: false,
        error: "آدرس باید با http:// یا https:// شروع شود.",
      };
    }

    if (!parsed.hostname) {
      return { valid: false, error: "نام میزبان (hostname) معتبر نیست." };
    }

    return { valid: true };
  } catch {
    return {
      valid: false,
      error: "ساختار آدرس URL معتبر نیست.",
    };
  }
}

export function buildUrlWithParams(
  baseUrl: string,
  params: KeyValuePair[],
): string {
  const trimmed = baseUrl.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    url.search = "";

    params
      .filter((p) => p.enabled && p.key.trim())
      .forEach((p) => {
        url.searchParams.append(p.key.trim(), p.value);
      });

    return url.toString();
  } catch {
    return trimmed;
  }
}

export function extractBaseUrl(fullUrl: string): string {
  const trimmed = fullUrl.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return trimmed.split("?")[0] ?? trimmed;
  }
}

export function parseParamsFromUrl(url: string): KeyValuePair[] {
  const trimmed = url.trim();
  if (!trimmed) return [];

  try {
    const parsed = new URL(trimmed);
    const params: KeyValuePair[] = [];

    parsed.searchParams.forEach((value, key) => {
      params.push({
        id: createId(),
        key,
        value,
        enabled: true,
      });
    });

    return params;
  } catch {
    return [];
  }
}

export function syncParamsWithUrl(
  baseUrl: string,
  params: KeyValuePair[],
): { baseUrl: string; params: KeyValuePair[] } {
  const trimmed = baseUrl.trim();
  if (!trimmed) return { baseUrl: "", params };

  try {
    const url = new URL(trimmed);
    const hasQuery = url.search.length > 1;

    if (hasQuery && params.every((p) => !p.key.trim())) {
      return {
        baseUrl: extractBaseUrl(trimmed),
        params: parseParamsFromUrl(trimmed),
      };
    }

    return {
      baseUrl: extractBaseUrl(trimmed),
      params,
    };
  } catch {
    return { baseUrl: trimmed, params };
  }
}
