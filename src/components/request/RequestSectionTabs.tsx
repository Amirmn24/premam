"use client";

import { useState } from "react";
import type { RequestSectionTab } from "@/types/request";
import { ParamsEditor } from "./ParamsEditor";
import { useActiveRequest } from "@/contexts/AppContext";
import { buildUrlWithParams } from "@/lib/url";

const SECTION_TABS: { id: RequestSectionTab; label: string; disabled?: boolean }[] = [
  { id: "params", label: "پارامترها" },
  { id: "headers", label: "هدرها", disabled: true },
  { id: "body", label: "بدنه", disabled: true },
];

export function RequestSectionTabs() {
  const [activeSection, setActiveSection] = useState<RequestSectionTab>("params");
  const { tab, setParams } = useActiveRequest();

  const handleParamsChange = (params: typeof tab.params) => {
    setParams(params);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-1 border-b border-border px-1">
        {SECTION_TABS.map((section) => (
          <button
            key={section.id}
            type="button"
            disabled={section.disabled}
            onClick={() => !section.disabled && setActiveSection(section.id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              section.disabled
                ? "cursor-not-allowed text-muted-foreground/40"
                : activeSection === section.id
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {section.label}
            {activeSection === section.id && !section.disabled && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeSection === "params" && (
          <div>
            <p className="mb-3 text-xs text-muted-foreground">
              پارامترهای کوئری به‌صورت خودکار در URL اعمال می‌شوند.
            </p>
            <ParamsEditor params={tab.params} onChange={handleParamsChange} />
            {buildUrlWithParams(tab.url, tab.params) && (
              <div className="mt-4 rounded-lg border border-dashed border-border p-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  پیش‌نمایش Query String
                </p>
                <code className="break-all text-xs text-foreground" dir="ltr">
                  {(() => {
                    try {
                      const url = new URL(buildUrlWithParams(tab.url, tab.params));
                      return url.search || "(بدون پارامتر)";
                    } catch {
                      return "(آدرس نامعتبر)";
                    }
                  })()}
                </code>
              </div>
            )}
          </div>
        )}

        {activeSection === "headers" && (
          <p className="text-sm text-muted-foreground">بخش هدرها در مرحله بعد پیاده‌سازی می‌شود.</p>
        )}

        {activeSection === "body" && (
          <p className="text-sm text-muted-foreground">بخش بدنه در مرحله بعد پیاده‌سازی می‌شود.</p>
        )}
      </div>
    </div>
  );
}
