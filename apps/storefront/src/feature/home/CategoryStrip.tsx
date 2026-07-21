import Image from "next/image";

const CATEGORIES = [
  {
    name: "Retro Kits",
    img: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&q=80",
  },
  {
    name: "National Teams",
    img: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400&q=80",
  },
  {
    name: "Club Home",
    img: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=400&q=80",
  },
  {
    name: "Away Kits",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80",
  },
  {
    name: "Legends",
    img: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400&q=80",
  },
  {
    name: "Accessories",
    img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&q=80",
  },
  {
    name: "Boots",
    img: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&q=80",
  },
  {
    name: "Training",
    img: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=400&q=80",
  },
];

export function CategoryStrip() {
  return (
    <section className="border-b border-hairline-soft py-16">
      <div className="container-page">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl md:text-5xl uppercase">
              Top Collections
            </h2>
            <p className="mt-2 text-sm text-mute">
              Browse the moments that defined the game.
            </p>
          </div>
          <a
            href="#"
            className="hidden md:inline text-sm font-medium underline underline-offset-4"
          >
            View all
          </a>
        </div>

        <div className="grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-6">
          {CATEGORIES.map((c) => (
            <a
              key={c.name}
              href="#"
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-pill bg-cloud ring-1 ring-hairline-soft">
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-ink">
                {c.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
