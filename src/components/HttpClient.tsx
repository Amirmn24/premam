"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { RequestBar } from "@/components/request/RequestBar";
import { RequestSectionTabs } from "@/components/request/RequestSectionTabs";
import { ResponsePanel } from "@/components/response/ResponsePanel";
import { useActiveRequest, useTabs } from "@/contexts/AppContext";
import { sendHttpRequest } from "@/lib/http";
import type { TabResponseState } from "@/types/response";

const EMPTY_RESPONSE: TabResponseState = {
  loading: false,
  response: null,
  error: null,
};

export function HttpClient() {
  const { activeTabId } = useTabs();
  const { tab } = useActiveRequest();
  const [responses, setResponses] = useState<Record<string, TabResponseState>>({});

  const currentResponse = responses[activeTabId] ?? EMPTY_RESPONSE;

  const handleSend = useCallback(
    async (finalUrl: string) => {
      setResponses((prev) => ({
        ...prev,
        [activeTabId]: { loading: true, response: null, error: null },
      }));

      const result = await sendHttpRequest({
        method: tab.method,
        url: finalUrl,
        headers: tab.headers,
        body: tab.body,
      });

      if (result.ok) {
        setResponses((prev) => ({
          ...prev,
          [activeTabId]: {
            loading: false,
            response: result.data,
            error: null,
          },
        }));
      } else {
        setResponses((prev) => ({
          ...prev,
          [activeTabId]: {
            loading: false,
            response: null,
            error: result.error,
          },
        }));
      }
    },
    [activeTabId, tab.method, tab.headers, tab.body],
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <TabBar />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border p-4">
            <RequestBar
              onSend={handleSend}
              isLoading={currentResponse.loading}
            />
          </div>
          <RequestSectionTabs />
        </div>

        <div className="flex min-h-[240px] flex-col lg:w-[45%] lg:shrink-0">
          <ResponsePanel state={currentResponse} />
        </div>
      </div>
    </div>
  );
}
