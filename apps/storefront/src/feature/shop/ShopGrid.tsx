import { ProductCard, type Product } from "@/feature/home/ProductCard";

interface ShopGridProps {
  products: Product[];
  viewMode?: string;
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
  const gridClasses = {
    "grid-2": "grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6",
    "grid-3": "grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6",
    "grid-4": "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6",
    "list": "flex flex-col gap-8 w-full",
  }[viewMode] || "grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6";

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout={isListView ? "list" : "grid"}
        />
      ))}
    </div>
  );
}
