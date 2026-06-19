"use client";

import { useState } from "react";
import type { TabResponseState } from "@/types/response";
import { StatusBadge } from "./StatusBadge";
import { ErrorAlert } from "./ErrorAlert";
import { formatResponseBody, isJsonContent } from "@/lib/http";

interface ResponsePanelProps {
  state: TabResponseState;
}

type ResponseTab = "body" | "headers";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResponsePanel({ state }: ResponsePanelProps) {
  const { loading, response, error } = state;
  const [activeTab, setActiveTab] = useState<ResponseTab>("body");

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

      <div className="relative flex flex-1 flex-col overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface/80 backdrop-blur-sm">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            <p className="text-sm font-medium text-foreground">در حال دریافت پاسخ...</p>
            <p className="text-xs text-muted-foreground">لطفاً صبر کنید</p>
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

            <div className="flex gap-1 border-b border-border px-2">
              <button
                type="button"
                onClick={() => setActiveTab("body")}
                className={`px-3 py-2 text-xs font-medium ${
                  activeTab === "body"
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground"
                }`}
              >
                بدنه
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("headers")}
                className={`px-3 py-2 text-xs font-medium ${
                  activeTab === "headers"
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground"
                }`}
              >
                هدرها ({Object.keys(response.headers).length})
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {activeTab === "body" && (
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
              )}

              {activeTab === "headers" && (
                <div className="flex-1 overflow-auto p-4">
                  {Object.keys(response.headers).length === 0 ? (
                    <p className="text-xs text-muted-foreground">(بدون هدر)</p>
                  ) : (
                    <table className="w-full text-xs" dir="ltr">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="pb-2 text-left font-medium">کلید</th>
                          <th className="pb-2 text-left font-medium">مقدار</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(response.headers).map(([key, value]) => (
                          <tr key={key} className="border-b border-border/50">
                            <td className="py-2 pr-4 font-medium text-accent">{key}</td>
                            <td className="break-all py-2 text-foreground">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
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
