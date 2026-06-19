"use client";

import { ThemeProvider, TabsProvider } from "@/contexts/AppContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TabsProvider>{children}</TabsProvider>
    </ThemeProvider>
  );
}
