"use client";

import { useMemo } from "react";
import { methodSupportsBody } from "@/lib/http";
import type { HttpMethod } from "@/types/request";

interface BodyEditorProps {
  method: HttpMethod;
  body: string;
  onChange: (body: string) => void;
}

export function BodyEditor({ method, body, onChange }: BodyEditorProps) {
  const supportsBody = methodSupportsBody(method);

  const jsonError = useMemo(() => {
    if (!supportsBody || !body.trim()) return null;

    try {
      JSON.parse(body);
      return null;
    } catch {
      return "ساختار JSON نامعتبر است (در صورت استفاده از JSON بررسی کنید).";
    }
  }, [body, supportsBody]);

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
    <div className="flex h-full min-h-[200px] flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          محتوای خام یا JSON — هنگام ارسال به‌عنوان بدنه درخواست استفاده می‌شود.
        </p>
        <button
          type="button"
          onClick={() => {
            onChange('{\n  \n}');
          }}
          className="text-xs text-accent hover:underline"
        >
          قالب JSON
        </button>
      </div>

      <textarea
        value={body}
        onChange={(e) => onChange(e.target.value)}
        placeholder='{"key": "value"}'
        className="min-h-[240px] flex-1 resize-y rounded-lg border border-border bg-surface p-3 font-mono text-sm leading-relaxed focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        dir="ltr"
        spellCheck={false}
        aria-label="بدنه درخواست"
      />

      {jsonError && body.trim().startsWith("{") && (
        <p className="text-xs text-amber-500" role="alert">
          {jsonError}
        </p>
      )}
    </div>
  );
}
