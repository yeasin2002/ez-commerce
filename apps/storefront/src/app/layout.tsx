import { cn } from "@/lib/utils";
import type { Metadata } from "next";

import { RootWrapper } from "@/components/shared/root-wrapper";
import { BRANDING } from "@/config";
import { fontVariables } from "@/lib/font";
import "./globals.css";

export const metadata: Metadata = {
  title: BRANDING.title,
  description: BRANDING.description,
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
      <body className={cn("min-h-full flex flex-col", fontVariables)}>
        <RootWrapper>{children}</RootWrapper>
      </body>
    </html>
  );
}
