const ITEMS = [
  "Free Shipping over $80",
  "30-Day Returns",
  "Official Licensed Kits",
  "Player Name & Number Printing",
  "Fast Global Delivery",
  "Secure Checkout",
];

export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <section className="border-y border-hairline-soft bg-ink py-5 overflow-hidden">
      <div className="marquee-track flex whitespace-nowrap gap-12 text-canvas font-display text-2xl uppercase tracking-widest">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            {item}
            <span className="text-sale text-3xl leading-none">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
