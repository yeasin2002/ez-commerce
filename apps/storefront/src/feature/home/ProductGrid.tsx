import { ProductCard, type Product } from "./ProductCard";

export function ProductGrid({
  eyebrow,
  title,
  subtitle,
  products,
  viewAllHref = "#",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  return (
    <section className="py-16">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            {eyebrow ? (
              <span className="text-xs uppercase tracking-[0.3em] text-mute">{eyebrow}</span>
            ) : null}
            <h2 className="mt-2 font-display text-4xl md:text-5xl uppercase">{title}</h2>
            {subtitle ? <p className="mt-2 text-sm text-mute">{subtitle}</p> : null}
          </div>
          <a href={viewAllHref} className="text-sm font-medium underline underline-offset-4">
            Shop all →
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {products.map((p, idx) => (
            <ProductCard key={p.id} product={p} priority={idx < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
