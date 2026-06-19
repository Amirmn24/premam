"use client";

import { useTabs } from "@/contexts/AppContext";
import { METHOD_COLORS } from "@/lib/constants";

export function TabBar() {
  const { tabs, activeTabId, setActiveTabId, addTab, closeTab } = useTabs();

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-surface-muted/30 px-2 py-1.5">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`group flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
            tab.id === activeTabId
              ? "bg-surface-elevated text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTabId(tab.id)}
            className="max-w-[140px] truncate"
          >
            <span className={`font-medium ${METHOD_COLORS[tab.method]}`}>{tab.method}</span>
            <span className="mx-1 text-muted-foreground">·</span>
            <span>{tab.name}</span>
          </button>

          {tabs.length > 1 && (
            <button
              type="button"
              onClick={() => closeTab(tab.id)}
              className="rounded p-0.5 opacity-0 transition-opacity hover:bg-surface-muted group-hover:opacity-100"
              aria-label={`بستن ${tab.name}`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addTab}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        aria-label="تب جدید"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
