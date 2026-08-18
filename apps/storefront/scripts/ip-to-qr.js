import os from "os";
import qrcode from "qrcode-terminal";
import c from "ansi-colors";

/**
 * Retrieves all active non-internal IPv4 network addresses of the machine.
 */
export function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // IPv4 and non-internal only
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push({
          interface: name,
          ip: iface.address,
        });
      }
    }
  }

  // Prefer Wi-Fi or Ethernet addresses (typically starting with 192.168, 10., or 172.)
  const preferred = addresses.find(
    (a) =>
      a.ip.startsWith("192.168.") ||
      a.ip.startsWith("10.") ||
      a.ip.startsWith("172."),
  );

  return preferred?.ip || addresses[0]?.ip || "localhost";
}

/**
 * Resolves the port from CLI arguments or environment variables.
 */
export function resolvePort(defaultPort = 8000) {
  const portArgIndex = process.argv.findIndex((arg) => arg === "--port" || arg === "-p");
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(parsed)) return parsed;
  }

  if (process.env.PORT) {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed)) return parsed;
  }

  return defaultPort;
}

/**
 * Displays the network IP QR code in the terminal.
 */
export function showNetworkQr(options = {}) {
  // Prevent duplicate printing if invoked multiple times
  if (globalThis.__NETWORK_QR_SHOWN__) {
    return;
  }
  globalThis.__NETWORK_QR_SHOWN__ = true;

  const port = options.port || resolvePort(8000);
  const ip = options.ip || getNetworkIp();
  const defaultRegion = process.env.NEXT_PUBLIC_DEFAULT_REGION || "gb";
  const networkUrl = `http://${ip}:${port}/${defaultRegion}`;
  const localUrl = `http://localhost:${port}/${defaultRegion}`;

  console.log("\n" + c.dim("─".repeat(56)));
  console.log(
    ` ${c.bold.cyan("📱 MOBILE PREVIEW & NETWORK QR CODE")}`
  );
  console.log(c.dim("─".repeat(56)));

  // Generate ASCII QR code
  qrcode.generate(networkUrl, { small: true }, (qr) => {
    // Indent QR code nicely
    const indentedQr = qr
      .split("\n")
      .map((line) => "   " + line)
      .join("\n");
    console.log(indentedQr);
  });

  console.log(`   ${c.bold("Local:")}    ${c.underline.blue(localUrl)}`);
  console.log(`   ${c.bold("Network:")}  ${c.underline.green(networkUrl)}`);
  console.log(
    `\n   ${c.yellow("👉 Scan the QR code above with your phone to preview instantly.")}`
  );
  console.log(c.dim("─".repeat(56)) + "\n");
}

/**
 * Next.js Plugin wrapper pattern:
 * withNetworkQr(nextConfig)
 */
export function withNetworkQr(nextConfig = {}) {
  if (process.env.NODE_ENV !== "production") {
    showNetworkQr();
  }

  return {
    ...nextConfig,
  };
}

export default withNetworkQr;

// Allow direct execution: node scripts/ip-to-qr.js
if (process.argv[1] && process.argv[1].endsWith("ip-to-qr.js")) {
  showNetworkQr();
}
