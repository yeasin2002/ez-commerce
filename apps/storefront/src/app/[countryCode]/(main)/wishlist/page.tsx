"use client";

import { Button } from "@/components/ui/button";
import { Footer } from "@/feature/home/Footer";
import { Header } from "@/feature/home/Header";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Set this to true to test the empty state, or false to test the populated state
const isWishlistEmpty = false;

interface WishlistItem {
  id: string;
  name: string;
  team: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export default function WishlistPage() {
  // Mock wishlist items matching the retro Milan jerseys and other popular kits
  const wishlistItems: WishlistItem[] = [
    {
      id: "wl-1",
      name: "AC Milan 1995/96 Home",
      team: "AC Milan",
      price: 34.0,
      originalPrice: 50.0,
      image:
        "https://images.unsplash.com/photo-1541002442297-50348f9757e5?w=500&q=80",
    },
    {
      id: "wl-2",
      name: "AC Milan 1998/99 Home",
      team: "AC Milan",
      price: 34.0,
      originalPrice: 50.0,
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
    },
    {
      id: "wl-3",
      name: "Barcelona 2024/25 Home Jersey",
      team: "FC Barcelona",
      price: 89.99,
      originalPrice: 119.99,
      image:
        "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=500&q=80",
    },
    {
      id: "wl-4",
      name: "Real Madrid 2024/25 Home Jersey",
      team: "Real Madrid",
      price: 95.0,
      image:
        "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=500&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <Header />

      <main className="flex-1 py-10 md:py-16">
        <div className="container-page">
          {/* Breadcrumbs */}
          <nav className="flex justify-center text-[11px] uppercase tracking-[0.18em] text-mute mb-3 font-sans">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span className="mx-2.5 select-none text-stone">•</span>
            <span className="text-ink font-medium">Wishlist</span>
          </nav>

          {/* Page Title */}
          <h1 className="text-center font-display text-4xl md:text-5xl uppercase tracking-wider text-ink mb-10 md:mb-16">
            Wishlist
          </h1>

          {isWishlistEmpty ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cloud text-stone mb-6">
                <Heart className="h-10 w-10 stroke-[1.25]" />
              </div>
              <h2 className="text-lg font-semibold text-ink mb-2 font-sans">
                Your wishlist is empty
              </h2>
              <p className="text-xs text-mute max-w-[280px] mb-8 leading-relaxed font-sans">
                Add items you love to your wishlist to see them here and compare
                your options.
              </p>
              <Link href="/shop" passHref legacyBehavior>
                <Button className="bg-ink hover:bg-charcoal text-canvas rounded-pill px-10 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer font-sans">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            /* Populated Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {wishlistItems.map((item) => {
                const onSale =
                  item.originalPrice && item.originalPrice > item.price;
                return (
                  <div key={item.id} className="group flex flex-col relative">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-cloud border border-hairline-soft">
                      {/* Remove Button */}
                      <button
                        aria-label="Remove from wishlist"
                        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-pill bg-canvas text-ink shadow-sm hover:scale-110 transition-transform cursor-pointer border border-hairline-soft"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      {/* Product Image */}
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Quick Add Button Overlay */}
                      <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <Button className="h-10 w-full rounded-pill bg-ink text-xs font-semibold uppercase tracking-wider text-canvas hover:bg-charcoal cursor-pointer font-sans">
                          Quick Add
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-4 flex flex-col gap-1">
                      <span className="text-[11px] uppercase tracking-[0.15em] text-mute font-sans">
                        {item.team}
                      </span>
                      <h4 className="text-sm font-medium text-ink line-clamp-1 font-sans group-hover:underline">
                        {item.name}
                      </h4>
                      <div className="mt-1 flex items-baseline gap-2 font-sans">
                        <span
                          className={`text-sm font-semibold ${onSale ? "text-sale" : "text-ink"}`}
                        >
                          ${item.price.toFixed(2)}
                        </span>
                        {onSale && (
                          <span className="text-xs text-mute line-through">
                            ${item.originalPrice!.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
