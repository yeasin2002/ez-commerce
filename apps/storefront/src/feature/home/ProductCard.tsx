"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export type Product = {
  id: string;
  handle?: string;
  name: string;
  team: string;
  price: number;
  original?: number;
  discount?: number;
  image: string;
  tag?: string;
  images?: string[];
  description?: string;
  details?: string[];
  sizes?: string[];
  players?: { name: string; label: string }[];
  patches?: string[];
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  viewingCount?: number;
  rawProduct?: unknown;
};

export function ProductCard({
  product,
  layout = "grid",
  priority = false,
}: {
  product: Product;
  layout?: "grid" | "list";
  priority?: boolean;
}) {
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "bn";
  const productLink = `/${countryCode}/shop/${product.handle || product.id}`;
  const onSale = product.original && product.original > product.price;

  if (layout === "list") {
    return (
      <Link
        href={productLink}
        className="group flex flex-row gap-6 border-b border-hairline-soft pb-6 items-center w-full"
      >
        {/* Product Image */}
        <div className="relative aspect-3/4 w-28 sm:w-36 overflow-hidden bg-cloud shrink-0 border border-hairline-soft">
          {product.discount ? (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-pill bg-sale px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-canvas">
              {product.discount}% Off
            </span>
          ) : product.tag ? (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-pill bg-canvas px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
              {product.tag}
            </span>
          ) : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 30vw, 15vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-1 sm:gap-1.5 min-w-0">
          <span className="text-[11px] uppercase tracking-[0.15em] text-mute">
            {product.team}
          </span>
          <h4 className="text-sm sm:text-base font-semibold text-ink line-clamp-2">
            {product.name}
          </h4>
          <p className="text-xs text-mute line-clamp-2 leading-relaxed hidden sm:block">
            {product.description ||
              "Premium quality athletic wear designed for performance and style."}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-sm font-bold ${onSale ? "text-sale" : "text-ink"}`}
            >
              ${product.price.toFixed(2)}
            </span>
            {onSale ? (
              <span className="text-xs text-mute line-through">
                ${product.original!.toFixed(2)}
              </span>
            ) : null}
          </div>
          <div className="mt-2.5">
            <button className="h-9 px-5 rounded-pill bg-ink text-[11px] font-semibold uppercase tracking-wider text-canvas hover:bg-charcoal transition-colors cursor-pointer border-0">
              Quick Add
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={productLink} className="group flex flex-col">
      <div className="relative aspect-3/4 overflow-hidden bg-cloud">
        {product.discount ? (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-pill bg-sale px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-canvas">
            {product.discount}% Off
          </span>
        ) : product.tag ? (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-pill bg-canvas px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
            {product.tag}
          </span>
        ) : null}

        <button
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-pill bg-canvas/90 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-canvas group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="h-10 w-full rounded-pill bg-ink text-xs font-semibold uppercase tracking-wider text-canvas">
            Quick Add
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.15em] text-mute">
          {product.team}
        </span>
        <h4 className="text-sm font-medium text-ink line-clamp-1">
          {product.name}
        </h4>
        <div className="mt-1 flex items-baseline gap-2">
          <span
            className={`text-sm font-semibold ${onSale ? "text-sale" : "text-ink"}`}
          >
            ${product.price.toFixed(2)}
          </span>
          {onSale ? (
            <span className="text-xs text-mute line-through">
              ${product.original!.toFixed(2)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
