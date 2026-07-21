export function PromoMarquee() {
  const items = Array(15)
    .fill(["Buy 3 Get 1 Free", "Free Shipping on 3+ Items"])
    .flat();

  return (
    <div className="w-full overflow-hidden border-y border-hairline-soft bg-cloud py-3 text-xs uppercase tracking-[0.25em] font-medium text-ink">
      <div className="flex w-max marquee-track">
        {items.map((item, index) => (
          <span key={index} className="mx-8 flex items-center gap-4">
            <span>{item}</span>
            <span className="h-1.5 w-1.5 rounded-pill bg-sale" />
          </span>
        ))}
      </div>
    </div>
  );
}
