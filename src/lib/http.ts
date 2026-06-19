import type { HttpMethod, KeyValuePair } from "@/types/request";
import type {
  HttpResponseData,
  RequestError,
  StatusCategory,
} from "@/types/response";
import { keyValuesToRecord } from "@/lib/keyValue";

const METHODS_WITH_BODY: HttpMethod[] = ["POST", "PUT", "PATCH", "DELETE"];

const DEFAULT_TIMEOUT_MS = 30_000;

export function methodSupportsBody(method: HttpMethod): boolean {
  return METHODS_WITH_BODY.includes(method);
}

export function getStatusCategory(status: number): StatusCategory {
  if (status >= 200 && status < 300) return "success";
  if (status >= 300 && status < 400) return "redirect";
  if (status >= 400 && status < 500) return "client";
  if (status >= 500) return "server";
  return "unknown";
}

export function getStatusLabel(category: StatusCategory): string {
  switch (category) {
    case "success":
      return "موفق";
    case "redirect":
      return "هدایت";
    case "client":
      return "خطای سمت کاربر";
    case "server":
      return "خطای سمت سرور";
    default:
      return "نامشخص";
  }
}

function findContentType(headers: KeyValuePair[]): string | null {
  const match = headers.find(
    (h) => h.enabled && h.key.trim().toLowerCase() === "content-type",
  );
  return match ? match.value.trim() : null;
}

export function validateBody(
  method: HttpMethod,
  body: string,
  headers: KeyValuePair[],
): RequestError | null {
  if (!methodSupportsBody(method) || !body.trim()) {
    return null;
  }

  const contentType = findContentType(headers)?.toLowerCase() ?? "";

  if (contentType.includes("application/json")) {
    try {
      JSON.parse(body);
    } catch {
      return {
        type: "validation",
        message: "بدنه JSON معتبر نیست. ساختار JSON را بررسی کنید.",
      };
    }
  }

  return null;
}

function parseRequestError(error: unknown): RequestError {
  if (error instanceof DOMException && error.name === "AbortError") {
    return {
      type: "timeout",
      message: "زمان انتظار برای پاسخ سرور به پایان رسید.",
    };
  }

  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();

    if (
      message.includes("failed to fetch") ||
      message.includes("networkerror") ||
      message.includes("network request failed")
    ) {
      return {
        type: "network",
        message:
          "خطای شبکه: اتصال به سرور برقرار نشد. اتصال اینترنت یا آدرس URL را بررسی کنید.",
      };
    }

    if (message.includes("cors")) {
      return {
        type: "cors",
        message:
          "درخواست توسط سیاست CORS مسدود شد. سرور مقصد اجازه دسترسی از این مبدأ را نمی‌دهد.",
      };
    }
  }

  if (error instanceof Error) {
    return {
      type: "unknown",
      message: error.message || "خطای ناشناخته در ارسال درخواست رخ داد.",
    };
  }

  return {
    type: "unknown",
    message: "خطای ناشناخته در ارسال درخواست رخ داد.",
  };
}

export interface SendRequestOptions {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  body: string;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export async function sendHttpRequest(
  options: SendRequestOptions,
): Promise<
  | { ok: true; data: HttpResponseData }
  | { ok: false; error: RequestError }
> {
  const { method, url, headers, body, timeoutMs = DEFAULT_TIMEOUT_MS } =
    options;

  const bodyError = validateBody(method, body, headers);
  if (bodyError) {
    return { ok: false, error: bodyError };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const combinedSignal = options.signal
    ? mergeAbortSignals(options.signal, controller.signal)
    : controller.signal;

  const startTime = performance.now();

  try {
    const requestHeaders = new Headers(keyValuesToRecord(headers));
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: combinedSignal,
    };

    if (methodSupportsBody(method) && body.trim()) {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    const responseBody = await response.text();
    const durationMs = Math.round(performance.now() - startTime);

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const sizeBytes = new Blob([responseBody]).size;

    return {
      ok: true,
      data: {
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
        headers: responseHeaders,
        durationMs,
        sizeBytes,
      },
    };
  } catch (error) {
    return { ok: false, error: parseRequestError(error) };
  } finally {
    clearTimeout(timeoutId);
  }
}

function mergeAbortSignals(
  external: AbortSignal,
  internal: AbortSignal,
): AbortSignal {
  if (external.aborted) return external;
  if (internal.aborted) return internal;

  const controller = new AbortController();

  const onAbort = () => controller.abort();
  external.addEventListener("abort", onAbort);
  internal.addEventListener("abort", onAbort);

  return controller.signal;
}

export function formatResponseBody(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) return body;

  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2);
  } catch {
    return body;
  }
}

export function isJsonContent(body: string): boolean {
  const trimmed = body.trim();
  if (!trimmed) return false;

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}
