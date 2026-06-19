"use client";

import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { RequestBar } from "@/components/request/RequestBar";
import { RequestSectionTabs } from "@/components/request/RequestSectionTabs";
import { ResponsePanel } from "@/components/response/ResponsePanel";

export function HttpClient() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <TabBar />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border p-4">
            <RequestBar />
          </div>
          <RequestSectionTabs />
        </div>

        <div className="flex min-h-[240px] flex-col lg:w-[45%] lg:shrink-0">
          <ResponsePanel />
        </div>
      </div>
    </div>
  );
}
