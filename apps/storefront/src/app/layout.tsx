import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";

import { RootWrapper } from "@/components/shared/root-wrapper";
import { BRANDING } from "@/config";
import { fontVariables } from "@/lib/font";
import "./globals.css";

export const metadata: Metadata = {
  title: BRANDING.title,
  description: BRANDING.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased")}
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-full flex flex-col overflow-x-hidden",
          fontVariables,
        )}
      >
        <RootWrapper>{children}</RootWrapper>
      </body>
    </html>
  );
}
