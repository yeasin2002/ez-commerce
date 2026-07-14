import { Heart } from "lucide-react";
import Image from "next/image";

export type Product = {
  id: string;
  name: string;
  team: string;
  price: number;
  original?: number;
  discount?: number;
  image: string;
  tag?: string;
};

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.original && product.original > product.price;
  return (
    <a href="#" className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-cloud">
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
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="h-10 w-full rounded-pill bg-ink text-xs font-semibold uppercase tracking-wider text-canvas">
            Quick Add
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.15em] text-mute">{product.team}</span>
        <h4 className="text-sm font-medium text-ink line-clamp-1">{product.name}</h4>
        <div className="mt-1 flex items-baseline gap-2">
          <span className={`text-sm font-semibold ${onSale ? "text-sale" : "text-ink"}`}>
            ${product.price.toFixed(2)}
          </span>
          {onSale ? (
            <span className="text-xs text-mute line-through">${product.original!.toFixed(2)}</span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
