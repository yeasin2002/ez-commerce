# EzCommerce Next.js + Capacitor Mobile Application Guide

This guide details how to develop, test, and build the **EzCommerce** storefront as a native mobile application for **Android** and **iOS** using **Capacitor.js** with live reload support.

---

## 1. System Architecture & Ports

The EzCommerce platform consists of three main services running on your local machine:

| Service | Local Host Port | Purpose | Phone Access Port (via ADB Reverse) |
|---|---|---|---|
| **Storefront (Next.js)** | `8000` | Customer-facing Next.js App | `localhost:8000` |
| **Backend (Medusa v2)** | `9000` | Commerce API, Cart, Checkout | `localhost:9000` |
| **Media Server (MinIO)** | `9010` | S3 Product Images & Media | `localhost:9010` |

### How USB Live Reload Works

```text
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT COMPUTER                     │
│                                                             │
│   Next.js Dev Server (Port 8000)                            │
│   Medusa Commerce API (Port 9000)                           │
│   MinIO Media Server (Port 9010)                            │
│                             ▲                               │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              │ USB Cable (via ADB Reverse)
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    PHYSICAL ANDROID PHONE                   │
│                                                             │
│   Capacitor App Shell (com.ezcommerce.storefront)           │
│   WebView loading: http://localhost:8000                    │
│   Direct API calls: http://localhost:9000                   │
│   Image loading: http://localhost:9010                      │
│                                                             │
│   Native Capabilities:                                      │
│   - Status Bar Theme Syncing (Light/Dark)                   │
│   - Hardware / Gesture Back Button Handling                 │
│   - Haptic Feedback on Add-to-Cart & Interactions           │
│   - Safe-Area Inset Handling (Notch / Punch-hole)           │
│   - Auto Splash Screen Dismissal                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Quick Start Development Checklist

### Step 1: Connect your Android Phone via USB
1. On your Android phone, enable **Developer Options** and turn on **USB Debugging**.
2. Connect your phone to your computer with a USB cable.
3. Unlock your phone and tap **Allow USB Debugging** if prompted.
4. Verify ADB sees your device:
   ```bash
   adb devices
   ```
   *Expected output: Your device ID followed by `device` (not `unauthorized` or empty).*

### Step 2: Set up Port Forwarding (ADB Reverse)
Forward all required service ports from your computer to the phone:

```bash
# Forward Next.js storefront dev server
adb reverse tcp:8000 tcp:8000

# Forward Medusa backend API
adb reverse tcp:9000 tcp:9000

# Forward MinIO media server (for product images)
adb reverse tcp:9010 tcp:9010
```

Verify your active port forwardings:
```bash
adb reverse --list
```
*Expected: List displaying `tcp:8000`, `tcp:9000`, and `tcp:9010`.*

### Step 3: Start the Next.js Storefront Server
From the root of the repository or `apps/storefront`:

```bash
# From repository root
pnpm storefront:dev

# Or directly in apps/storefront
cd apps/storefront
pnpm dev
```
*The Next.js storefront starts at `http://localhost:8000`.*

### Step 4: Verify in Phone Browser
Open Google Chrome on your Android phone and visit:
```text
http://localhost:8000
```
- [x] The EzCommerce homepage loads.
- [x] Product images load.
- [x] Store features work normally.

---

## 3. Initializing Native Mobile Platforms

Run these commands inside `apps/storefront` or from root using pnpm workspace filtering.

### Adding Android Platform
```bash
cd apps/storefront
npx cap add android
```

### Adding iOS Platform (macOS only)
```bash
cd apps/storefront
npx cap add ios
```

### Synchronizing Configuration & Plugins
Whenever you install new Capacitor plugins or update `capacitor.config.ts`, synchronize native projects:

```bash
# From apps/storefront
pnpm cap:sync

# Or from root
pnpm --filter storefront cap:sync
```

---

## 4. Running the Native Application

### Direct CLI Run (No Android Studio Required)
Just like in React Native (`npx react-native run-android`), you can build and launch directly from your terminal:

```bash
cd apps/storefront
pnpm cap:run:android
# Or: npx cap run android
```

This will automatically build the debug APK via Gradle, install it onto your USB-connected phone, and launch the EzCommerce app.

### Optional: Opening in Android Studio GUI
If you want to use Android Studio for native debugging:
```bash
cd apps/storefront
pnpm cap:android
```

### Opening in Xcode (iOS / macOS)
```bash
cd apps/storefront
pnpm cap:run:ios
# Or open in Xcode: pnpm cap:ios
```

---

## 5. Live Reload Workflow

With Capacitor configured with `server.url: "http://localhost:8000"`:

1. **Edit Code**: Make a change in any Next.js component in `apps/storefront/src/`.
2. **Save**: Next.js Fast Refresh recompiles instantly.
3. **Instant Update**: The changes appear immediately in the Capacitor native app on your phone without rebuilding the native APK!

---

## 6. Built-in Native Features & Helpers

The storefront includes a dedicated Capacitor integration module at `src/lib/capacitor/`:

### 1. Haptic Feedback (`triggerHaptic`)
Use native vibration & tactile feedback for enhanced mobile UX:
```tsx
import { triggerHaptic } from "@/lib/capacitor";

// On button click or add to cart:
<Button
  onClick={() => {
    triggerHaptic("light");
    addToCart();
  }}
>
  Add to Cart
</Button>

// On successful checkout or notification:
triggerHaptic("success");

// On validation error:
triggerHaptic("error");
```

Supported haptic styles:
- `'light'` — subtle tap (buttons, navigation)
- `'medium'` — standard action tap
- `'heavy'` — high-emphasis actions
- `'selection'` — picker / carousel / filter selection
- `'success'` — success notification vibration pattern
- `'warning'` — warning notification vibration pattern
- `'error'` — error notification vibration pattern

### 2. Status Bar Synchronization
The `<MobileInitializer />` component automatically synchronizes the native mobile status bar style and background color with the user's active light/dark theme preference.

### 3. Android Hardware Back Button
The app listens for the Android hardware/gesture back button:
- Navigates back in history when inside deep routes (`/shop/[id]`, `/cart`, `/checkout`, `/account`).
- Minimizes the app gracefully when on the top-level home screen instead of abruptly crashing or closing.

### 4. Safe Area Insets (Notches & Dynamic Island)
Tailwind CSS utility classes are available in `globals.css`:
- `pt-safe`: `padding-top: env(safe-area-inset-top)`
- `pb-safe`: `padding-bottom: env(safe-area-inset-bottom)`
- `pl-safe`: `padding-left: env(safe-area-inset-left)`
- `pr-safe`: `padding-right: env(safe-area-inset-right)`
- `min-h-screen-safe`: Safe height accounting for top/bottom insets

---

## 7. Capacitor Configuration Reference

File: `apps/storefront/capacitor.config.ts`

```ts
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ezcommerce.storefront",
  appName: "EzCommerce",
  webDir: "public",
  server: {
    // Port 8000 matches Next.js dev server for ez-commerce storefront
    url: process.env.CAPACITOR_SERVER_URL || "http://localhost:8000",
    cleartext: true,
    androidScheme: "https",
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
```

---

## 8. Troubleshooting & Common Issues

### Issue: `ERR_CLEARTEXT_NOT_PERMITTED` or blank screen
- **Cause**: Android blocks plain `http://` traffic by default unless `cleartext: true` is configured.
- **Fix**: Verify `server.cleartext: true` is present in `capacitor.config.ts`, then run `pnpm cap:sync` and rebuild the app in Android Studio.

### Issue: `net::ERR_CONNECTION_REFUSED`
- **Cause**: `adb reverse` is not running or the Next.js dev server is stopped.
- **Fix**:
  1. Ensure Next.js dev server is running on `http://localhost:8000`.
  2. Run `adb reverse tcp:8000 tcp:8000` (and `tcp:9000 tcp:9000`).
  3. Verify with `adb reverse --list`.

### Issue: Device shows `unauthorized` in `adb devices`
- **Fix**:
  1. Unlock the phone screen.
  2. Look for the "Allow USB debugging?" dialog.
  3. Check "Always allow from this computer" and tap **Allow**.

### Issue: Android back button closes app immediately
- **Fix**: Handled by `<MobileInitializer />` inside `RootWrapper` using `@capacitor/app` `addListener('backButton')`.

---

## 9. Monorepo Scripts Reference

Run these from the monorepo root or directly in `apps/storefront`:

| Command | Action |
|---|---|
| `pnpm storefront:dev` | Start Next.js storefront dev server on port 8000 |
| `pnpm --filter storefront cap:sync` | Sync Capacitor configuration, web files, and plugins |
| `pnpm --filter storefront cap:copy` | Fast copy web/config assets without plugin re-indexing |
| `pnpm --filter storefront cap:android` | Open the native Android project in Android Studio |
| `pnpm --filter storefront cap:ios` | Open the native iOS project in Xcode (macOS) |
| `pnpm --filter storefront cap:run:android` | Build and deploy directly to connected Android device |
| `pnpm --filter storefront cap:run:ios` | Build and deploy directly to connected iOS device |