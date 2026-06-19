"use client";

import { useState } from "react";
import type { RequestSectionTab } from "@/types/request";
import { ParamsEditor } from "./ParamsEditor";
import { HeadersEditor } from "./HeadersEditor";
import { BodyEditor } from "./BodyEditor";
import { useActiveRequest } from "@/contexts/AppContext";
import { buildUrlWithParams } from "@/lib/url";
import { methodSupportsBody } from "@/lib/http";

const SECTION_TABS: { id: RequestSectionTab; label: string }[] = [
  { id: "params", label: "پارامترها" },
  { id: "headers", label: "هدرها" },
  { id: "body", label: "بدنه" },
];

export function RequestSectionTabs() {
  const [activeSection, setActiveSection] = useState<RequestSectionTab>("params");
  const { tab, setParams, setHeaders, setBody, setBodyType } = useActiveRequest();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-1 border-b border-border px-1">
        {SECTION_TABS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {section.label}
            {section.id === "body" && !methodSupportsBody(tab.method) && (
              <span className="mr-1 text-[10px] text-muted-foreground/60">(—)</span>
            )}
            {activeSection === section.id && (
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
            <ParamsEditor params={tab.params} onChange={setParams} />
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
          <div>
            <p className="mb-3 text-xs text-muted-foreground">
              هدرهای فعال هنگام ارسال درخواست اعمال می‌شوند (مثل Content-Type و Authorization).
            </p>
            <HeadersEditor headers={tab.headers} onChange={setHeaders} />
          </div>
        )}

        {activeSection === "body" && (
          <BodyEditor
            method={tab.method}
            body={tab.body}
            bodyType={tab.bodyType}
            headers={tab.headers}
            onChange={setBody}
            onBodyTypeChange={setBodyType}
            onHeadersChange={setHeaders}
          />
        )}
      </div>
    </div>
  );
}
