"use client";

import { useMemo } from "react";
import { methodSupportsBody } from "@/lib/http";
import type { BodyType, HttpMethod, KeyValuePair } from "@/types/request";
import { syncContentTypeHeader } from "@/lib/requestFactory";

interface BodyEditorProps {
  method: HttpMethod;
  body: string;
  bodyType: BodyType;
  headers: KeyValuePair[];
  onChange: (body: string) => void;
  onBodyTypeChange: (bodyType: BodyType) => void;
  onHeadersChange: (headers: KeyValuePair[]) => void;
}

export function BodyEditor({
  method,
  body,
  bodyType,
  headers,
  onChange,
  onBodyTypeChange,
  onHeadersChange,
}: BodyEditorProps) {
  const supportsBody = methodSupportsBody(method);

  const jsonError = useMemo(() => {
    if (!supportsBody || bodyType !== "json" || !body.trim()) return null;

    try {
      JSON.parse(body);
      return null;
    } catch {
      return "ساختار JSON نامعتبر است.";
    }
  }, [body, bodyType, supportsBody]);

  const handleTypeChange = (type: BodyType) => {
    onBodyTypeChange(type);
    onHeadersChange(syncContentTypeHeader(headers, type));
  };

  if (!supportsBody) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          متد <span className="font-mono font-semibold">{method}</span> معمولاً بدنه ندارد.
        </p>
        <p className="text-xs text-muted-foreground">
          برای ارسال بدنه از متدهای POST، PUT، PATCH یا DELETE استفاده کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[200px] flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex rounded-lg border border-border p-0.5">
          <button
            type="button"
            onClick={() => handleTypeChange("json")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              bodyType === "json"
                ? "bg-accent text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            JSON
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("raw")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              bodyType === "raw"
                ? "bg-accent text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Raw
          </button>
        </div>

        {bodyType === "json" && (
          <button
            type="button"
            onClick={() => onChange('{\n  \n}')}
            className="text-xs text-accent hover:underline"
          >
            قالب JSON
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {bodyType === "json"
          ? "بدنه به‌صورت JSON ارسال می‌شود. Content-Type روی application/json تنظیم می‌شود."
          : "بدنه به‌صورت متن خام ارسال می‌شود. Content-Type روی text/plain تنظیم می‌شود."}
      </p>

      <textarea
        value={body}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          bodyType === "json" ? '{\n  "key": "value"\n}' : "متن خام درخواست..."
        }
        className="min-h-[240px] flex-1 resize-y rounded-lg border border-border bg-surface p-3 font-mono text-sm leading-relaxed focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        dir="ltr"
        spellCheck={false}
        aria-label="بدنه درخواست"
      />

      {jsonError && (
        <p className="text-xs text-amber-500" role="alert">
          {jsonError}
        </p>
      )}
    </div>
  );
}
