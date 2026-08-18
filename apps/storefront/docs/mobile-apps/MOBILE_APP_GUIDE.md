# EzCommerce Mobile App Testing & Installation Guide

This guide gives you the exact step-by-step process to run, test, and install the **EzCommerce Native Mobile App** (Android / iOS) on your physical phone or emulator.

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Android Studio** installed (for Android) or **Xcode** installed (for iOS on macOS).
2. **Android SDK & Command-line Tools** installed via Android Studio.
3. An **Android Phone** with **USB Debugging enabled** (or an Android Virtual Device / iOS Simulator).
4. A **USB Cable** to connect your phone to your computer.

---

## 🚀 Quick Step-by-Step Workflow

### Step 1: Initialize the Native Mobile Project (One-time only)

From the `apps/storefront` folder, initialize the native Android platform (and iOS if on Mac):

```bash
cd apps/storefront

# Add Android native project
npx cap add android

# Add iOS native project (macOS only)
# npx cap add ios
```

*This creates the native `android/` project folder with the Capacitor native bridge.*

---

### Step 2: Connect Your Android Phone via USB

1. On your phone, go to **Settings > About Phone** and tap **Build Number** 7 times to enable **Developer Options**.
2. Go to **Settings > System > Developer Options** and enable **USB Debugging**.
3. Connect your phone to your PC via USB cable.
4. On your PC terminal, run:
   ```bash
   adb devices
   ```
5. Look at your phone screen and tap **Allow USB Debugging** (check "Always allow from this computer").
6. Verify your device is recognized:
   ```bash
   adb devices
   ```
   *Expected output: Your device serial number with the word `device`.*

---

### Step 3: Forward Local Ports to the Phone (ADB Reverse)

Because your Next.js server, Medusa backend, and MinIO image server run on your computer, forward their ports through the USB cable:

```bash
# 1. Forward Next.js Storefront (Port 8000)
adb reverse tcp:8000 tcp:8000

# 2. Forward Medusa Backend API (Port 9000)
adb reverse tcp:9000 tcp:9000

# 3. Forward MinIO Media Server (Port 9010)
adb reverse tcp:9010 tcp:9010
```

Verify the port mappings:
```bash
adb reverse --list
```
*You should see active mappings for ports `8000`, `9000`, and `9010`.*

---

### Step 4: Start the Backend & Storefront Servers

Keep these terminal windows running on your computer:

#### Terminal 1 — Start Medusa Backend
```bash
# From the repository root
pnpm backend:dev
```

#### Terminal 2 — Start Next.js Storefront
```bash
# From the repository root
pnpm storefront:dev
```
*Next.js will be running on `http://localhost:8000`.*

---

### Step 5: Build, Install & Launch on Phone (Direct Terminal Command)

Just like `react-native run-android`, you **do NOT need to open Android Studio**. You can build, deploy, and launch directly from your terminal:

```bash
# Run from apps/storefront
pnpm cap:run:android

# Or with npx
npx cap run android
```

What this command does automatically:
1. Syncs your Capacitor configuration and web assets.
2. Detects your USB-connected Android phone.
3. Builds the native Android debug APK via Gradle.
4. Installs the APK onto your phone over USB.
5. Automatically launches the **EzCommerce** app on your phone screen!

> **Note**: If you have multiple devices/emulators connected, it will prompt you with an interactive list to choose your target device, or you can pass `--target=<device_id>`.

---

### Optional: Open in Android Studio GUI (Only if needed)

If you ever prefer using Android Studio for native Java/Kotlin debugging, profiling, or Gradle inspector:

```bash
pnpm cap:android
```

---

## 🔄 Live Reload & Development Experience

Once the app is running on your phone:

- **Edit Code**: Open any component (e.g. `src/feature/home/Hero.tsx` or `src/app/[countryCode]/page.tsx`).
- **Save**: Change text or colors and press Save (`Ctrl + S`).
- **Instant Result**: The changes update **instantly on your physical phone** without needing to reinstall or rebuild in Android Studio!

---

## 📦 How to Build a Standalone Installable APK (To share/install directly)

If you want to create a `.apk` file that you can install directly on any Android phone:

### Method 1: Using Android Studio (GUI)
1. In Android Studio, go to the top menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Once Gradle finishes building, a popup in the bottom right will say **APK(s) generated successfully**.
3. Click **locate** to find `app-debug.apk`.
4. Transfer `app-debug.apk` to your phone (via WhatsApp, Google Drive, or USB) and install it!

### Method 2: Using Command Line
Inside `apps/storefront/android`:
```bash
cd apps/storefront/android
./gradlew assembleDebug
```
*The APK will be generated at: `apps/storefront/android/app/build/outputs/apk/debug/app-debug.apk`.*

---

## 🛠️ Testing Checklist on the Mobile App

When testing on your phone, check:

- [ ] **Splash Screen**: Shows the EzCommerce branding and smoothly dismisses.
- [ ] **Status Bar**: Adapts cleanly when switching between Light Mode and Dark Mode.
- [ ] **Safe-Area Insets**: Header and checkout forms don't collide with the camera notch or punch-hole.
- [ ] **Haptics**: Subtle tactile vibrations on interactive buttons.
- [ ] **Hardware Back Button**: Pressing the Android back button navigates back in pages instead of exiting the app immediately.
- [ ] **Commerce Features**: Cart additions, regional switching (`/bn`, `/us`), and checkout flow work seamlessly.

---

## ❓ Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **`error: invalid source release: 21`** | System `JAVA_HOME` is set to Java 17 instead of Java 21 | Run in terminal: `$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"` |
| **App shows blank white screen** | Cleartext HTTP traffic blocked or server not reachable | Ensure `cleartext: true` is in `capacitor.config.ts` and run `adb reverse tcp:8000 tcp:8000`. |
| **Images do not load** | MinIO port not forwarded | Run `adb reverse tcp:9010 tcp:9010`. |
| **API calls fail** | Medusa backend not forwarded | Run `adb reverse tcp:9000 tcp:9000` and ensure backend is running. |
| **Device not listed in `adb devices`** | USB debugging unauthorized or cable is charge-only | Check phone notification bar, set USB mode to File Transfer / MTP, and accept debugging prompt. |
