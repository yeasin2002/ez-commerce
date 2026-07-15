import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  // { label: "Collections", to: "/" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
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
            <IconBtn label="Account">
              <User className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="Wishlist">
              <Heart className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="Cart" badge={2}>
              <ShoppingBag className="h-5 w-5" />
            </IconBtn>
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

function IconBtn({
  children,
  label,
  badge,
}: {
  children: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-cloud focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-pill bg-ink px-1 text-[10px] font-semibold text-canvas">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
