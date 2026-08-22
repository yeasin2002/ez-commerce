"use client";

import { useParams } from "next/navigation";
import { ProductCard } from "@/feature/home/ProductCard";
import { useProducts } from "@lib/hooks/api/use-products";
import { mapStoreProductToProduct } from "@lib/util/map-product";
import { ProductGridSkeleton } from "@/feature/home/ProductGrid";

export function RelatedProducts({
  currentProductId,
}: {
  currentProductId: string;
}) {
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "bd";

  const { data, isLoading } = useProducts(countryCode);

  const dbProducts = data?.pages.flatMap((page) => page.products) || [];
  const related = dbProducts
    .filter((p) => p.id !== currentProductId && p.handle !== currentProductId)
    .slice(0, 4)
    .map(mapStoreProductToProduct);

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="py-16 border-t border-hairline-soft">
      <div>
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl uppercase">
            People Also Bought
          </h2>
          <p className="mt-2 text-sm text-mute">
            Here are some of our most similar products people are buying.
          </p>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p, idx) => (
              <ProductCard key={p.id} product={p} priority={idx < 4} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
