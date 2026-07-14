import { ProductCard, type Product } from "@/feature/home/ProductCard";

interface ShopGridProps {
  products: Product[];
}

export function ShopGrid({ products }: ShopGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-mute">
        <p className="text-sm">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
