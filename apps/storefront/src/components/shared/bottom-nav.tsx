"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Home, ShoppingBag, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerHaptic, useIsNative } from "@/lib/capacitor";

export function BottomNav() {
  const pathname = usePathname();
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "bn";
  const isNative = useIsNative();

  // Strict check: Never show on web browser (even in responsive/mobile dev tools mode)
  if (!isNative) {
    return null;
  }

  // Hide on checkout pages for distraction-free checkout experience
  if (pathname?.includes("/checkout")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      href: `/${countryCode}`,
      icon: Home,
      isActive:
        pathname === `/${countryCode}` ||
        pathname === `/${countryCode}/` ||
        pathname === "/",
    },
    {
      label: "Shop",
      href: `/${countryCode}/shop`,
      icon: ShoppingBag,
      isActive: pathname.startsWith(`/${countryCode}/shop`),
    },
    {
      label: "Contact",
      href: `/${countryCode}/contact`,
      icon: PhoneCall,
      isActive: pathname.startsWith(`/${countryCode}/contact`),
    },
  ];

  return (
    <>
      {/* Spacer so bottom scroll content is not covered by fixed bottom nav on mobile */}
      <div className="h-16 pb-safe w-full pointer-events-none" />

      <nav
        aria-label="Mobile App Navigation"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-canvas/95 dark:bg-card/95 backdrop-blur-md",
          "border-t border-hairline-soft dark:border-border",
          "pb-safe shadow-[0_-2px_12px_rgba(0,0,0,0.05)]",
          "transition-all duration-200"
        )}
      >
        <div className="flex h-14 items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => triggerHaptic("selection")}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-all duration-150 cursor-pointer select-none",
                  item.isActive
                    ? "text-ink dark:text-foreground font-semibold"
                    : "text-mute dark:text-muted-foreground hover:text-ink dark:hover:text-foreground"
                )}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-150",
                      item.isActive
                        ? "stroke-[2.4px] scale-110"
                        : "stroke-[1.8px]"
                    )}
                  />
                </div>
                <span className="text-[11px] font-medium tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
