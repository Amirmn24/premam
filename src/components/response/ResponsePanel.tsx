"use client";

import type { TabResponseState } from "@/types/response";
import { StatusBadge } from "./StatusBadge";
import { ErrorAlert } from "./ErrorAlert";
import { formatResponseBody, isJsonContent } from "@/lib/http";

interface ResponsePanelProps {
  state: TabResponseState;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResponsePanel({ state }: ResponsePanelProps) {
  const { loading, response, error } = state;

  return (
    <div className="flex min-h-[200px] flex-1 flex-col border-t border-border lg:min-h-0 lg:border-l lg:border-t-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-semibold text-foreground">پاسخ</h2>
        {response && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{response.durationMs} ms</span>
            <span>{formatBytes(response.sizeBytes)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            <p className="text-sm text-muted-foreground">در حال دریافت پاسخ...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex-1 overflow-auto p-4">
            <ErrorAlert error={error} />
          </div>
        )}

        {!loading && !error && response && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-border px-4 py-3">
              <StatusBadge status={response.status} statusText={response.statusText} />
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="border-b border-border px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground">محتوای پاسخ</span>
              </div>
              <pre
                className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground"
                dir="ltr"
              >
                {response.body
                  ? isJsonContent(response.body)
                    ? formatResponseBody(response.body)
                    : response.body
                  : "(بدنه خالی)"}
              </pre>
            </div>
          </div>
        )}

        {!loading && !error && !response && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              درخواستی ارسال نشده است.
              <br />
              پس از ارسال، کد وضعیت و محتوای پاسخ اینجا نمایش داده می‌شود.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
