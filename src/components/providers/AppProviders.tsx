"use client";

import {
  ThemeProvider,
  TabsProvider,
  CollectionsProvider,
  HistoryProvider,
} from "@/contexts/AppContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TabsProvider>
        <CollectionsProvider>
          <HistoryProvider>{children}</HistoryProvider>
        </CollectionsProvider>
      </TabsProvider>
    </ThemeProvider>
  );
}
