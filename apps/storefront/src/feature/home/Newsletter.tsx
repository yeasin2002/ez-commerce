import { ArrowRight } from "lucide-react";

export function Newsletter() {
  return (
    <section className="bg-ink py-20 text-canvas">
      <div className="container-page grid gap-12 md:grid-cols-2 md:items-end">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-stone">Join the club</span>
          <h2 className="mt-3 font-display text-5xl md:text-6xl uppercase leading-[0.9]">
            First to know.<br />First to wear.
          </h2>
          <p className="mt-6 max-w-md text-canvas/70">
            Kit drops, restocks, and members-only pricing — dropped in your inbox before they hit the site.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <label className="text-xs uppercase tracking-[0.2em] text-stone">Email address</label>
          <div className="flex h-14 items-center rounded-pill bg-canvas/10 pl-6 pr-2 ring-1 ring-canvas/20 focus-within:ring-canvas/60">
            <input
              type="email"
              required
              placeholder="you@somewhere.com"
              className="flex-1 bg-transparent text-canvas placeholder:text-stone outline-none"
            />
            <button className="inline-flex h-11 items-center gap-2 rounded-pill bg-canvas px-6 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-stone">
            By subscribing you agree to our privacy policy. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}
