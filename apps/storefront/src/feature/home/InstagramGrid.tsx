import { IconBrandInstagram } from "@tabler/icons-react";
import Image from "next/image";

const POSTS = [
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80",
  "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=500&q=80",
  "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=80",
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=500&q=80",
  "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=500&q=80",
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80",
];

export function InstagramGrid() {
  return (
    <section className="py-16">
      <div className="container-page mb-8 flex items-end justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-mute">@footystylehub</span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl uppercase">On the Feed</h2>
        </div>
        <a href="#" className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
          <IconBrandInstagram className="h-4 w-4" /> Follow
        </a>
      </div>

      <div className="grid grid-cols-2 gap-1 md:grid-cols-6">
        {POSTS.map((src, i) => (
          <a key={i} href="#" className="group relative aspect-square overflow-hidden bg-cloud">
            <Image
              src={src}
              alt={`Instagram post ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 16.6vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/40">
              <IconBrandInstagram className="h-6 w-6 text-canvas opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
