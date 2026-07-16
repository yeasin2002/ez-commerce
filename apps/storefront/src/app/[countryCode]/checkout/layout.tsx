import React from "react";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

interface CheckoutLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    countryCode: string;
  }>;
}

export default async function CheckoutLayout({
  children,
  params,
}: CheckoutLayoutProps) {
  const { countryCode } = await params;

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans flex flex-col">
      {/* Sticky, distraction-free Checkout Header */}
      <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-hairline-soft">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Brand Logo */}
            <Link href={`/${countryCode}`} className="flex items-center gap-1">
              <span className="font-display text-2xl tracking-wider uppercase">
                ez<span className="text-mute">-commerce</span>
              </span>
            </Link>

            {/* Back to Cart link */}
            <Link
              href={`/${countryCode}/cart`}
              className="inline-flex items-center gap-1.5 text-xs text-mute hover:text-ink transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to cart</span>
            </Link>
          </div>

          {/* Secure indicator */}
          <div className="flex items-center gap-1.5 text-xs text-mute font-medium uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main layout container */}
      <main className="flex-1 bg-cloud/10">
        {children}
      </main>
    </div>
  );
}
