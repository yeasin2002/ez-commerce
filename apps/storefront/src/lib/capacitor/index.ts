import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import {
  Haptics,
  ImpactStyle,
  NotificationType,
} from "@capacitor/haptics";
import { useSyncExternalStore } from "react";

/**
 * Checks if the application is running inside a Capacitor native container (Android or iOS).
 */
export function isNativePlatform(): boolean {
  return typeof window !== "undefined" && Capacitor.isNativePlatform();
}

const emptySubscribe = () => () => {};

/**
 * React hook to safely subscribe to native platform status without cascading re-renders or hydration mismatch.
 */
export function useIsNative(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => isNativePlatform(),
    () => false
  );
}

/**
 * Returns the current platform ('android' | 'ios' | 'web').
 */
export function getPlatform(): "android" | "ios" | "web" {
  if (typeof window === "undefined") return "web";
  return Capacitor.getPlatform() as "android" | "ios" | "web";
}

export function isAndroid(): boolean {
  return getPlatform() === "android";
}

export function isIOS(): boolean {
  return getPlatform() === "ios";
}

export type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

/**
 * Triggers native haptic feedback on mobile devices.
 * Gracefully falls back to web vibration API or no-op.
 */
export async function triggerHaptic(type: HapticType = "light"): Promise<void> {
  if (!isNativePlatform()) {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      if (type === "light" || type === "selection") {
        navigator.vibrate(10);
      } else if (type === "medium") {
        navigator.vibrate(25);
      } else if (type === "heavy" || type === "error") {
        navigator.vibrate([40, 30, 40]);
      } else if (type === "success") {
        navigator.vibrate([20, 20, 20]);
      }
    }
    return;
  }

  try {
    switch (type) {
      case "light":
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case "medium":
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case "heavy":
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case "selection":
        await Haptics.selectionStart();
        await Haptics.selectionChanged();
        await Haptics.selectionEnd();
        break;
      case "success":
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case "warning":
        await Haptics.notification({ type: NotificationType.Warning });
        break;
      case "error":
        await Haptics.notification({ type: NotificationType.Error });
        break;
    }
  } catch (error) {
    // Graceful silent fallback if haptics is unsupported
    console.debug("[Capacitor] Haptics error:", error);
  }
}

/**
 * Synchronizes the native status bar with the current theme.
 */
export async function syncStatusBar(theme: "light" | "dark" = "light"): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    if (theme === "dark") {
      await StatusBar.setStyle({ style: Style.Dark });
      if (isAndroid()) {
        await StatusBar.setBackgroundColor({ color: "#18181B" });
      }
    } else {
      await StatusBar.setStyle({ style: Style.Light });
      if (isAndroid()) {
        await StatusBar.setBackgroundColor({ color: "#FFFFFF" });
      }
    }
  } catch (error) {
    console.debug("[Capacitor] StatusBar error:", error);
  }
}

/**
 * Hides the native splash screen smoothly.
 */
export async function hideSplashScreen(): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    await SplashScreen.hide({
      fadeOutDuration: 300,
    });
  } catch (error) {
    console.debug("[Capacitor] SplashScreen error:", error);
  }
}

/**
 * Registers an Android hardware back button handler.
 * Returns an unregister cleanup function.
 */
export function registerBackButtonHandler(
  onBack: (canGoBack: boolean) => void
): () => void {
  if (!isNativePlatform()) return () => {};

  let removeListener: (() => void) | null = null;

  App.addListener("backButton", (event) => {
    onBack(event.canGoBack);
  }).then((handle) => {
    removeListener = () => handle.remove();
  });

  return () => {
    if (removeListener) {
      removeListener();
    }
  };
}
