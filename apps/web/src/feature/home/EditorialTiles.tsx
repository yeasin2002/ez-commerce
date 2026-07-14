import Image from "next/image";

const TILES = [
  {
    title: "Anticipated Matchup",
    caption: "El Clásico Kits — Shop the Rivalry",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&q=80",
  },
  {
    title: "The Playmakers",
    caption: "Signature editions from top scorers",
    image: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=1000&q=80",
  },
  {
    title: "Champions of Europe",
    caption: "UCL winners' collection",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1000&q=80",
  },
];

export function EditorialTiles() {
  return (
    <section className="py-8">
      <div className="container-page grid gap-4 md:grid-cols-3 md:gap-6">
        {TILES.map((t) => (
          <a
            key={t.title}
            href="#"
            className="group relative aspect-[3/4] overflow-hidden bg-ink"
          >
            <Image
              src={t.image}
              alt={t.title}
              fill
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-canvas">
              <span className="text-xs uppercase tracking-[0.3em] text-canvas/70">{t.caption}</span>
              <h3 className="mt-2 font-display text-3xl md:text-4xl uppercase leading-none">{t.title}</h3>
              <span className="mt-4 inline-flex h-10 items-center rounded-pill bg-canvas px-5 text-xs font-semibold uppercase tracking-wider text-ink">
                Shop Now
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
