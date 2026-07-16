"use client"

import { Button } from "@/components/ui/button";
import { Heart, Menu, Moon, Search, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShowCarts } from "./show-carts";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  // { label: "Collections", to: "/" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-wider">
              FOOTY<span className="text-mute">STYLE</span>HUB
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.to}
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
              href={"/account"}
              aria-label="Account"
              className="cursor-pointer"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              href={"/wishlist"}
              aria-label="Wishlist"
              className="cursor-pointer"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <ShowCarts />

            <button
              aria-label="Menu"
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-pill bg-cloud"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
