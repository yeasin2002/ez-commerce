"use client";

import { mapStoreProductToProduct } from "@lib/util/map-product";
import { useProducts } from "@lib/hooks/api/use-products";
import { useIntersection } from "@lib/hooks/use-in-view";
import { useQueryState, parseAsString } from "nuqs";
import { useEffect, useRef } from "react";
import { ShopGrid, ProductSkeletonGrid } from "./ShopGrid";
import { ShopToolbar } from "./ShopToolbar";

interface ShopContentProps {
  countryCode: string;
}

export function ShopContent({ countryCode }: ShopContentProps) {
  const [viewMode, setViewMode] = useQueryState(
    "view",
    parseAsString.withDefault("grid-4"),
  );
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString.withDefault("az"),
  );
  const [activeCategory] = useQueryState("category");

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts(countryCode, activeCategory || undefined);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isIntersecting = useIntersection(sentinelRef, "200px");

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten infinite query page data
  const dbProducts = data?.pages.flatMap((page) => page.products) || [];
  const products = dbProducts.map(mapStoreProductToProduct);

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
        onRefetch={() => refetch()}
        isRefetching={isRefetching}
      />
      {isLoading ? (
        <ProductSkeletonGrid viewMode={viewMode} />
      ) : (
        <>
          <ShopGrid products={sortedProducts} viewMode={viewMode} />

          {/* Scroll Sentinel */}
          <div ref={sentinelRef} className="h-10 w-full" />

          {/* Next Page Spinner */}
          {isFetchingNextPage && (
            <div className="mt-8 flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-mute border-t-ink" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
