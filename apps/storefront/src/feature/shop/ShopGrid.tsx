import { ProductCard, type Product } from "@/feature/home/ProductCard";

interface ShopGridProps {
  products: Product[];
  viewMode?: string;
}

export function ProductSkeletonGrid({
  viewMode = "grid-3",
}: {
  viewMode?: string;
}) {
  const isListView = viewMode === "list";
  const gridClasses =
    {
      "grid-2": "grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6",
      "grid-3": "grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6",
      "grid-4":
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6",
      list: "flex flex-col gap-8 w-full",
    }[viewMode] ||
    "grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6";

  const skeletonCount = 8;

  return (
    <div className={gridClasses}>
      {Array.from({ length: skeletonCount }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse flex ${
            isListView
              ? "flex-row gap-6 border-b border-hairline-soft pb-6 items-center w-full"
              : "flex-col"
          }`}
        >
          {/* Image skeleton */}
          <div
            className={`bg-cloud border border-hairline-soft relative shrink-0 ${
              isListView ? "aspect-3/4 w-28 sm:w-36" : "aspect-3/4 w-full"
            }`}
          />
          {/* Details skeleton */}
          <div className="flex-1 flex flex-col gap-2 mt-4">
            <div className="h-3 bg-cloud rounded w-1/4" />
            <div className="h-4 bg-cloud rounded w-3/4" />
            {isListView && (
              <div className="h-3 bg-cloud rounded w-5/6 hidden sm:block" />
            )}
            <div className="h-4 bg-cloud rounded w-1/3" />
            {isListView && (
              <div className="h-9 bg-cloud rounded-pill w-24 mt-2.5" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShopGrid({ products, viewMode = "grid-3" }: ShopGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-mute">
        <p className="text-sm">No products found.</p>
      </div>
    );
  }

  const isListView = viewMode === "list";
  const gridClasses =
    {
      "grid-2": "grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6",
      "grid-3": "grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6",
      "grid-4":
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6",
      list: "flex flex-col gap-8 w-full",
    }[viewMode] ||
    "grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6";

  return (
    <div className={gridClasses}>
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          layout={isListView ? "list" : "grid"}
          priority={idx < 4}
        />
      ))}
    </div>
  );
}
