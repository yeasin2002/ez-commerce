"use client";

import { type Product } from "@/feature/home/ProductCard";
import { useQueryState, parseAsString } from "nuqs";
import { ShopGrid } from "./ShopGrid";
import { ShopToolbar } from "./ShopToolbar";

interface ShopContentProps {
  products: Product[];
}

export function ShopContent({ products }: ShopContentProps) {
  const [viewMode, setViewMode] = useQueryState(
    "view",
    parseAsString.withDefault("grid-4")
  );
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString.withDefault("az")
  );

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "az") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "za") {
      return b.name.localeCompare(a.name);
    }
    if (sortBy === "low-high") {
      return a.price - b.price;
    }
    if (sortBy === "high-low") {
      return b.price - a.price;
    }
    if (sortBy === "best-selling") {
      return (b.soldCount || 0) - (a.soldCount || 0);
    }
    return 0;
  });

  return (
    <div className="flex-1">
      <ShopToolbar
        activeMode={viewMode}
        onModeChange={(mode) => setViewMode(mode)}
        sortBy={sortBy}
        onSortChange={(sort) => setSortBy(sort)}
      />
      <ShopGrid products={sortedProducts} viewMode={viewMode} />
    </div>
  );
}
