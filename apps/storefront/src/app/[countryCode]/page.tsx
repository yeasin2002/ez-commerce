"use client";

import { useParams } from "next/navigation";
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

export default function HomePage() {
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "bd";

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
          collectionHandle="best-sellers"
          viewAllHref={`/${countryCode}/shop?collection=best-sellers`}
          limit={4}
        />
        <EditorialTiles />
        <Marquee />
        <ProductGrid
          eyebrow="Just Landed"
          title="New Arrivals"
          subtitle="Fresh drops, straight from the pitch."
          collectionHandle="new-arrivals"
          viewAllHref={`/${countryCode}/shop?collection=new-arrivals`}
          limit={4}
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
