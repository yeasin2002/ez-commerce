"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

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

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-6 text-ink">
      {/* Products Category Accordion */}
      <div className="border-b border-hairline-soft pb-6">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="flex w-full items-center justify-between text-left font-semibold text-sm uppercase tracking-wider py-2"
        >
          <span>Products Category</span>
          {categoriesOpen ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            categoriesOpen
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0 pointer-events-none"
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
    </aside>
  );
}
