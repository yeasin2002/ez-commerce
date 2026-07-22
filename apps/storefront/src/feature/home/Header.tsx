"use client";

import { Button } from "@/components/ui/button";
import { Heart, Menu, Moon, Search, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShowCarts } from "./show-carts";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRANDING } from "@/config";
import Image from "next/image";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  // { label: "Collections", to: "/" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "bn";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-canvas">
      {/* Utility bar */}
      <div className="bg-ink text-canvas">
        <div className="container-page flex h-9 items-center justify-between text-[11px] uppercase tracking-[0.18em]">
          <span className="text-stone">Free shipping on orders over $80</span>
          <div className="hidden gap-6 md:flex text-stone">
            <a href="#" className="hover:text-canvas transition-colors">
              Help
            </a>
            <a href="#" className="hover:text-canvas transition-colors">
              Track Order
            </a>
            <a href="#" className="hover:text-canvas transition-colors">
              EN / USD
            </a>
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <div className="border-b border-hairline-soft">
        <div className="container-page flex h-16 items-center gap-6">
          <Link href={`/${countryCode}`} className="flex items-center gap-2">
            <Image
              width={200}
              height={200}
              src={BRANDING.logo}
              alt={BRANDING.title}
              priority
            />

            {/* <span className="font-display text-2xl tracking-wider">
              FOOTY<span className="text-mute">STYLE</span>HUB
            </span> */}
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={`/${countryCode}${n.to === "/" ? "" : n.to}`}
                className="text-sm font-medium text-ink transition-colors hover:text-mute [&.active]:underline underline-offset-8 decoration-2"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex h-10 items-center gap-2 rounded-pill bg-cloud px-4 w-64">
              <Search className="h-4 w-4 text-mute" />
              <input
                type="search"
                placeholder="Search jerseys, teams, players"
                className="w-full bg-transparent text-sm placeholder:text-mute outline-none"
              />
            </div>
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-pill size-8 cursor-pointer"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Link
              href={`/${countryCode}/account`}
              aria-label="Account"
              className="cursor-pointer"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              href={`/${countryCode}/wishlist`}
              aria-label="Wishlist"
              className="cursor-pointer"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <ShowCarts />

            <MobileHeaderSheet />
          </div>
        </div>
      </div>
    </header>
  );
}

export const MobileHeaderSheet = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "bn";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Menu"
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-pill bg-cloud text-ink cursor-pointer hover:opacity-85 transition-opacity"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col h-full bg-canvas text-ink border-r border-hairline-soft w-[300px] sm:w-[380px] p-6 focus-visible:outline-none"
      >
        <SheetHeader className="border-b border-hairline-soft pb-5 text-left">
          <SheetTitle className="font-display text-2xl tracking-wider uppercase text-ink">
            FOOTY<span className="text-mute">STYLE</span>HUB
          </SheetTitle>
          <SheetDescription className="sr-only">
            Mobile Navigation Menu
          </SheetDescription>
        </SheetHeader>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-6 mt-6">
          {NAV.map((n) => (
            <SheetClose key={n.label} asChild>
              <Link
                href={`/${countryCode}${n.to === "/" ? "" : n.to}`}
                className="text-lg font-medium tracking-wide uppercase transition-colors hover:text-mute"
              >
                {n.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        {/* Footer Area - Bottom of Drawer */}
        <div className="mt-auto border-t border-hairline-soft pt-6 flex flex-col gap-5">
          <SheetClose asChild>
            <Link
              href={`/${countryCode}/account`}
              className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-ink hover:text-mute transition-colors"
            >
              <User className="h-4 w-4 text-mute" />
              <span>My Account</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href={`/${countryCode}/wishlist`}
              className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-ink hover:text-mute transition-colors"
            >
              <Heart className="h-4 w-4 text-mute" />
              <span>Wishlist</span>
            </Link>
          </SheetClose>

          {mounted && (
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-hairline-soft/50">
              <span className="text-xs text-mute font-medium uppercase tracking-wider">
                Appearance
              </span>
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                variant="outline"
                size="sm"
                className="rounded-pill px-4 cursor-pointer text-xs border-hairline-soft hover:bg-cloud"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
