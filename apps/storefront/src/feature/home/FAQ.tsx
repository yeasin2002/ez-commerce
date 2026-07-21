import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Are the kits officially licensed?",
    a: "Yes. Every jersey ships direct from official brand distributors — Nike, adidas, Puma, and Castore — with authentic tagging and hologram verification.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard: 4–7 business days worldwide. Express: 2–3 business days. Free shipping on orders over $80.",
  },
  {
    q: "Can I add custom name and number printing?",
    a: "Absolutely. Add player printing at checkout for $12. Custom names are non-refundable.",
  },
  {
    q: "How do I find my size?",
    a: "Every product page has a full size chart with chest and length measurements. Kits fit true to size; go up one for a looser fit.",
  },
  {
    q: "What's your return policy?",
    a: "30 days for unworn, unwashed kits without custom printing. Return shipping is free within the US and EU.",
  },
  {
    q: "Do you restock sold-out kits?",
    a: "Popular kits restock every 2–3 weeks. Add to wishlist to get notified the moment they're back.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-t border-hairline-soft py-20">
      <div className="container-page grid gap-12 md:grid-cols-[1fr_2fr]">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-mute">
            Support
          </span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl uppercase">
            FAQ
          </h2>
          <p className="mt-4 text-sm text-mute max-w-xs">
            Everything you need to know before you check out. Still stuck?
            Message our team — we usually reply within an hour.
          </p>
        </div>

        <div>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-hairline-soft">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="text-base md:text-lg font-medium text-ink">
                    {f.q}
                  </span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0" />
                  )}
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-6"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-sm text-charcoal leading-relaxed max-w-2xl">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
