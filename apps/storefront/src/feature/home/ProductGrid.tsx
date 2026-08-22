"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductCard, type Product } from "./ProductCard";
import { useCollectionProducts } from "@lib/hooks/api/use-products";
import { mapStoreProductToProduct } from "@lib/util/map-product";

export interface ProductGridProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  collectionHandle?: string;
  products?: Product[];
  viewAllHref?: string;
  limit?: number;
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="animate-pulse flex flex-col">
          <div className="aspect-3/4 w-full bg-cloud border border-hairline-soft relative shrink-0" />
          <div className="flex flex-col gap-2 mt-4">
            <div className="h-3 bg-cloud rounded w-1/4" />
            <div className="h-4 bg-cloud rounded w-3/4" />
            <div className="h-4 bg-cloud rounded w-1/3 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({
  eyebrow,
  title,
  subtitle,
  collectionHandle,
  products: manualProducts,
  viewAllHref,
  limit = 4,
}: ProductGridProps) {
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "bd";

  const { data, isLoading } = useCollectionProducts(
    countryCode,
    collectionHandle,
    limit,
  );

  const displayProducts: Product[] =
    manualProducts ||
    data?.products?.map(mapStoreProductToProduct) ||
    [];

  const resolvedViewAllHref =
    viewAllHref ||
    (collectionHandle
      ? `/${countryCode}/shop?collection=${collectionHandle}`
      : `/${countryCode}/shop`);

  return (
    <section className="py-16">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            {eyebrow ? (
              <span className="text-xs uppercase tracking-[0.3em] text-mute">
                {eyebrow}
              </span>
            ) : null}
            <h2 className="mt-2 font-display text-4xl md:text-5xl uppercase">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-2 text-sm text-mute">{subtitle}</p>
            ) : null}
          </div>
          <Link
            href={resolvedViewAllHref}
            className="text-sm font-medium underline underline-offset-4 hover:text-mute transition-colors"
          >
            Shop all →
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={limit} />
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {displayProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} priority={idx < 4} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-mute text-sm">
            No products currently available in this collection.
          </div>
        )}
      </div>
    </section>
  );
}
