import { ArrowRight } from "lucide-react";

export function FeatureBanner() {
  return (
    <section className="py-16">
      <div className="container-page grid gap-6 md:grid-cols-[1fr_1.3fr]">
        <div
          className="relative aspect-[4/5] md:aspect-auto overflow-hidden rounded-none bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&q=80&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-canvas">
            <span className="text-xs uppercase tracking-[0.3em] text-canvas/70">
              Limited Edition
            </span>
            <h3 className="mt-2 font-display text-5xl md:text-6xl uppercase leading-none">
              2026 World
              <br />
              Cup Kits
            </h3>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 bg-cloud p-8 md:p-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-mute">
              Now on the Pitch
            </span>
            <h3 className="mt-3 font-display text-5xl md:text-7xl uppercase leading-[0.9]">
              The kits have arrived.
            </h3>
            <p className="mt-6 max-w-md text-base text-charcoal">
              Every national team, every home and away shirt, delivered day-one.
              Shop early — sizes for the top teams sell out within hours of
              drop.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex h-12 items-center gap-2 rounded-pill bg-ink px-6 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
            >
              Shop the World Cup <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex h-12 items-center rounded-pill border border-ink px-6 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              See Every Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
