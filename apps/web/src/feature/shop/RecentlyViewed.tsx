"use client";

import { useEffect, useState } from "react";
import { ProductCard, type Product } from "@/feature/home/ProductCard";
import { ALL_PRODUCTS } from "@/data/products.data";

export function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    if (!currentProductId) return;
    try {
      const stored = localStorage.getItem("footy_recently_viewed");
      const list: string[] = stored ? JSON.parse(stored) : [];

      // Exclude current product for the display list
      const displayIds = list.filter((id) => id !== currentProductId);
      const displayProducts = displayIds
        .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => !!p);

      setTimeout(() => {
        setItems(displayProducts.slice(0, 4));
      }, 0);

      // Update storage with the current product at the front
      const updatedList = [
        currentProductId,
        ...list.filter((id) => id !== currentProductId),
      ].slice(0, 8); // Keep last 8 items
      localStorage.setItem("footy_recently_viewed", JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <section className="py-16 border-t border-hairline-soft">
      <div>
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl uppercase">Recently Viewed</h2>
          <p className="mt-2 text-sm text-mute">Explore your recently viewed items, blending quality and style for a refined living experience.</p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
