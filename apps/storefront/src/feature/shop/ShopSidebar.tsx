"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

const CATEGORIES = [
  "Serie A",
  "Ligue 1",
  "Kids",
  "Training Kits",
  "Windbreakers",
  "Tracksuits",
  "Boots",
];

export function ShopSidebar() {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [featuredOpen, setFeaturedOpen] = useState(true);

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-6 text-ink">
      {/* Products Category Accordion */}
      <div className="border-b border-hairline-soft pb-6">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="flex w-full items-center justify-between text-left font-semibold text-sm uppercase tracking-wider py-2"
        >
          <span>Products Category</span>
          {categoriesOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            categoriesOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 pointer-events-none"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-3 text-xs text-charcoal">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button className="hover:text-ink transition-colors text-left w-full font-medium">
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Featured Player Accordion */}
      <div className="border-b border-hairline-soft pb-6">
        <button
          onClick={() => setFeaturedOpen(!featuredOpen)}
          className="flex w-full items-center justify-between text-left font-semibold text-sm uppercase tracking-wider py-2"
        >
          <span>Featured Player</span>
          {featuredOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            featuredOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 pointer-events-none"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex items-center gap-3 bg-cloud/30 p-3 rounded-lg border border-hairline-soft hover:bg-cloud/50 transition-colors cursor-pointer">
              <div className="relative aspect-[3/4] w-14 overflow-hidden bg-cloud rounded border border-hairline-soft">
                <Image
                  src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150&q=80"
                  alt="Santos 2013 Home"
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                <h4 className="text-xs font-semibold text-ink truncate leading-snug">
                  Santos 2013 Home
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs font-bold text-sale">$32.00</span>
                  <span className="text-[10px] text-mute line-through">$50.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
