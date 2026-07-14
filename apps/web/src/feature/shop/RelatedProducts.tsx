import { ProductCard } from "@/feature/home/ProductCard";
import { ALL_PRODUCTS } from "@/data/products.data";

export function RelatedProducts({ currentProductId }: { currentProductId: string }) {
  // Exclude current product and get up to 4 related products
  const related = ALL_PRODUCTS.filter((p) => p.id !== currentProductId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-16 border-t border-hairline-soft">
      <div>
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl uppercase">People Also Bought</h2>
          <p className="mt-2 text-sm text-mute">Here are some of our most similar products people are buying.</p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
