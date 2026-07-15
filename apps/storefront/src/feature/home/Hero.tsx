import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-canvas">
      <div
        className="relative min-h-[70vh] md:min-h-[85vh] w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%), url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=80&auto=format&fit=crop')",
        }}
      >
        <div className="container-page relative flex min-h-[70vh] md:min-h-[85vh] flex-col justify-end pb-16 md:pb-24">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-pill bg-canvas/10 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.25em] ring-1 ring-canvas/30">
              <span className="h-1.5 w-1.5 rounded-pill bg-sale" /> New Season Drop
            </p>
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.85] uppercase">
              Wear the
              <br />
              <span className="italic font-light">glory.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-canvas/80">
              Authentic kits, iconic silhouettes, and limited drops from the clubs that made the game. Every stitch, every crest — the way it should be.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#collections" className="inline-flex h-12 items-center gap-2 rounded-pill bg-canvas px-7 text-sm font-medium text-ink transition-transform hover:scale-[1.02]">
                Shop New Arrivals <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#collections" className="inline-flex h-12 items-center rounded-pill border border-canvas/40 px-7 text-sm font-medium text-canvas transition-colors hover:bg-canvas/10">
                Explore Collections
              </a>
            </div>
          </div>

          {/* Floating offer chip — right side */}
          <div className="hidden md:flex absolute right-10 top-1/3 flex-col items-end text-right">
            <span className="text-xs uppercase tracking-[0.3em] text-canvas/60">New Offer</span>
            <span className="font-display text-6xl uppercase leading-none">Buy 3<br />Jerseys</span>
            <span className="mt-2 text-sm text-canvas/70">Free gift guaranteed →</span>
          </div>
        </div>
      </div>
    </section>
  );
}
