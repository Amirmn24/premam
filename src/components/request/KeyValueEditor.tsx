"use client";

import type { KeyValuePair } from "@/types/request";
import { createEmptyKeyValue } from "@/lib/keyValue";

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  addLabel: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  enableAriaLabel?: string;
  removeAriaLabel?: string;
}

export function KeyValueEditor({
  items,
  onChange,
  addLabel,
  keyPlaceholder = "کلید",
  valuePlaceholder = "مقدار",
  enableAriaLabel = "فعال‌سازی",
  removeAriaLabel = "حذف",
}: KeyValueEditorProps) {
  const updateItem = (
    id: string,
    field: keyof KeyValuePair,
    value: string | boolean,
  ) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    const filtered = items.filter((item) => item.id !== id);
    onChange(filtered.length > 0 ? filtered : [createEmptyKeyValue()]);
  };

  const addItem = () => {
    onChange([...items, createEmptyKeyValue()]);
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
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-surface-muted/50 p-2 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
          >
            <label className="flex items-center justify-center sm:w-8">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => updateItem(item.id, "enabled", e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
                aria-label={enableAriaLabel}
              />
            </label>

            <input
              type="text"
              value={item.key}
              onChange={(e) => updateItem(item.id, "key", e.target.value)}
              placeholder={keyPlaceholder}
              className="h-9 rounded-md border border-border bg-surface px-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
              dir="ltr"
              spellCheck={false}
            />

            <input
              type="text"
              value={item.value}
              onChange={(e) => updateItem(item.id, "value", e.target.value)}
              placeholder={valuePlaceholder}
              className="h-9 rounded-md border border-border bg-surface px-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
              dir="ltr"
              spellCheck={false}
            />

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="flex h-9 w-full items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 sm:h-8 sm:w-8"
              aria-label={removeAriaLabel}
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
        onClick={addItem}
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
        {addLabel}
      </button>
    </div>
  );
}
