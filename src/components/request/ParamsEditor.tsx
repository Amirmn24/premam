"use client";

import type { KeyValuePair } from "@/types/request";
import { createEmptyParam } from "@/lib/url";

interface ParamsEditorProps {
  params: KeyValuePair[];
  onChange: (params: KeyValuePair[]) => void;
}

export function ParamsEditor({ params, onChange }: ParamsEditorProps) {
  const updateParam = (id: string, field: keyof KeyValuePair, value: string | boolean) => {
    onChange(
      params.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const removeParam = (id: string) => {
    const filtered = params.filter((p) => p.id !== id);
    onChange(filtered.length > 0 ? filtered : [createEmptyParam()]);
  };

  const addParam = () => {
    onChange([...params, createEmptyParam()]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="hidden grid-cols-[auto_1fr_1fr_auto] gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid">
        <span className="w-8" />
        <span>کلید</span>
        <span>مقدار</span>
        <span className="w-8" />
      </div>

      <div className="flex flex-col gap-2">
        {params.map((param) => (
          <div
            key={param.id}
            className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-surface-muted/50 p-2 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
          >
            <label className="flex items-center justify-center sm:w-8">
              <input
                type="checkbox"
                checked={param.enabled}
                onChange={(e) => updateParam(param.id, "enabled", e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
                aria-label="فعال‌سازی پارامتر"
              />
            </label>

            <input
              type="text"
              value={param.key}
              onChange={(e) => updateParam(param.id, "key", e.target.value)}
              placeholder="کلید"
              className="h-9 rounded-md border border-border bg-surface px-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
              dir="ltr"
              spellCheck={false}
            />

            <input
              type="text"
              value={param.value}
              onChange={(e) => updateParam(param.id, "value", e.target.value)}
              placeholder="مقدار"
              className="h-9 rounded-md border border-border bg-surface px-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
              dir="ltr"
              spellCheck={false}
            />

            <button
              type="button"
              onClick={() => removeParam(param.id)}
              className="flex h-9 w-full items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 sm:h-8 sm:w-8"
              aria-label="حذف پارامتر"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addParam}
        className="flex w-fit items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-accent transition-colors hover:bg-accent/10"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        افزودن پارامتر
      </button>
    </div>
  );
}
