"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";
import { BottomNav } from "./bottom-nav";
import { MobileInitializer } from "./mobile-initializer";

export const RootWrapper = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        // enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <MobileInitializer />
            {children}
            <BottomNav />
          </NuqsAdapter>
        </QueryClientProvider>
      </NextThemesProvider>
    </>
  );
};
