import { Star } from "lucide-react";
import Image from "next/image";

const REVIEWS = [
  {
    name: "Marcus D.",
    location: "London, UK",
    quote:
      "The stitching, the crest, the fabric weight — feels exactly like the on-pitch kit. Shipped in three days.",
    product: "Real Madrid 2024/25 Home",
    avatar:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&q=80",
  },
  {
    name: "Priya S.",
    location: "Mumbai, IN",
    quote:
      "Ordered a retro Milan 06 shirt. Ridiculous quality for the price. My uncle almost cried.",
    product: "AC Milan 2006/07 Away",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  },
  {
    name: "Diego R.",
    location: "Buenos Aires, AR",
    quote:
      "Custom name & number came out perfect. This is now my everyday jersey.",
    product: "Argentina 2022 Home",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="bg-cloud py-20">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-mute">
            What ballers are saying
          </span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl uppercase">
            Verified fans. Real kits.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="flex flex-col justify-between gap-6 bg-canvas p-8"
            >
              <div>
                <div className="mb-4 flex gap-0.5 text-ink">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-base text-charcoal leading-relaxed">
                  {r.quote}
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-3 border-t border-hairline-soft pt-4">
                <Image
                  src={r.avatar}
                  alt={r.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-pill object-cover"
                  style={{ width: "auto", height: "auto" }}
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-ink">{r.name}</div>
                  <div className="text-xs text-mute">
                    {r.location} · {r.product}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
