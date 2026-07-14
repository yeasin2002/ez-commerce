"use client";

import { CategoryStrip } from "@/feature/home/CategoryStrip";
import { EditorialTiles } from "@/feature/home/EditorialTiles";
import { FAQ } from "@/feature/home/FAQ";
import { FeatureBanner } from "@/feature/home/FeatureBanner";
import { Footer } from "@/feature/home/Footer";
import { Header } from "@/feature/home/Header";
import { Hero } from "@/feature/home/Hero";
import { InstagramGrid } from "@/feature/home/InstagramGrid";
import { Marquee } from "@/feature/home/Marquee";
import { Newsletter } from "@/feature/home/Newsletter";
import { ProductGrid } from "@/feature/home/ProductGrid";
import { Testimonials } from "@/feature/home/Testimonials";
import { ValueProps } from "@/feature/home/ValueProps";

import { BEST_SELLERS, NEW_ARRIVALS } from "@/data/products.data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main>
        <Hero />
        <ValueProps />
        <CategoryStrip />
        <FeatureBanner />
        <ProductGrid
          eyebrow="Trending"
          title="Best Sellers"
          subtitle="This month's most-worn kits."
          products={BEST_SELLERS}
        />
        <EditorialTiles />
        <Marquee />
        <ProductGrid
          eyebrow="Just Landed"
          title="New Arrivals"
          subtitle="Fresh drops, straight from the pitch."
          products={NEW_ARRIVALS}
        />
        <Testimonials />
        <InstagramGrid />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
