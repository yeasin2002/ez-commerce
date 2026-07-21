"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  const currentImage = images[activeIdx] || images[0];

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-6">
      {/* Thumbnails list */}
      <div className="flex flex-row gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-x-visible md:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden bg-cloud transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:w-20 ${
              activeIdx === idx
                ? "ring-2 ring-ink"
                : "ring-1 ring-hairline-soft opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`${name} thumbnail ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 80px, 100px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main product display */}
      <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-cloud ring-1 ring-hairline-soft">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="object-cover transition-all duration-300"
          />
        ) : null}

        {/* Expand zoom icon */}
        <button
          aria-label="Expand image"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-pill bg-canvas/80 text-ink shadow-sm backdrop-blur transition-colors hover:bg-canvas"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
