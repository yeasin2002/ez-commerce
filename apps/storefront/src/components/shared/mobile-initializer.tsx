"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import {
  hideSplashScreen,
  isNativePlatform,
  registerBackButtonHandler,
  syncStatusBar,
} from "@/lib/capacitor";

export function MobileInitializer() {
  const { resolvedTheme, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Synchronize native status bar with active theme
  useEffect(() => {
    const currentTheme = (resolvedTheme || theme || "light") === "dark" ? "dark" : "light";
    syncStatusBar(currentTheme);
  }, [resolvedTheme, theme]);

  // Hide splash screen on mount & handle hardware back button
  useEffect(() => {
    if (!isNativePlatform()) return;

    // Smoothly dismiss native splash screen once React app is ready
    hideSplashScreen();

    // Register Android hardware / gesture back button handler
    const cleanup = registerBackButtonHandler((canGoBack) => {
      // Check if we are at root or a top-level page
      const segments = pathname.split("/").filter(Boolean);
      // segments: [] for "/", [countryCode] for "/bn", etc.
      const isTopLevel = segments.length <= 1;

      if (!isTopLevel && canGoBack) {
        router.back();
      } else {
        // At top-level home screen, minimize the native app
        App.minimizeApp();
      }
    });

    return () => {
      cleanup();
    };
  }, [pathname, router]);

  return null;
}
