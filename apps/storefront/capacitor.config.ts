import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ezcommerce.storefront",
  appName: "EzCommerce",
  webDir: "public",
  server: {
    // Port 8000 matches Next.js dev server for ez-commerce storefront
    // Run 'adb reverse tcp:8000 tcp:8000' to forward phone requests to host machine
    url: process.env.CAPACITOR_SERVER_URL || "http://localhost:8000",
    cleartext: true,
    androidScheme: "https",
    errorPath: "offline.html",
  },
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#FFFFFF",
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#FFFFFF",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },
    App: {},
  },
};

export default config;
