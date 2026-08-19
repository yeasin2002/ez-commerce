"use client";

import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import { Footer } from "@/feature/home/Footer";
import { Header } from "@/feature/home/Header";
import { ProductAccordions } from "@/feature/shop/product-accordions";
import { ProductGallery } from "@/feature/shop/ProductGallery";
import { PromoMarquee } from "@/feature/shop/PromoMarquee";
import { RelatedProducts } from "@/feature/shop/RelatedProducts";
import { SingleProductInfo } from "@/feature/shop/single-product-Info";
import { useProduct } from "@lib/hooks/api/use-products";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string }>;
}) {
  const { id, countryCode } = use(params);
  const { data: dbProduct, isLoading, error } = useProduct(id, countryCode);

    const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
      {
        description: true,
      },
    );
  
    const toggleAccordion = (key: string) => {
      setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

  useEffect(() => {
    if (dbProduct) {
      console.log("=== SINGLE PRODUCT API DATA ===", {
        id,
        countryCode,
        title: dbProduct.title,
        handle: dbProduct.handle,
        variants: dbProduct.variants,
        options: dbProduct.options,
        images: dbProduct.images,
        fullProduct: dbProduct,
      });
    }
  }, [dbProduct, id, countryCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-ink" />
            <p className="text-xs text-mute font-medium uppercase tracking-wider">
              Loading product details...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !dbProduct) {
    return (
      <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-2 font-display">
            Product Not Found
          </h2>
          <p className="text-xs text-mute mb-6 font-sans">
            Could not find details for product: {id}
          </p>
          <Link
            href={`/${countryCode}/shop`}
            className="rounded-full bg-ink text-canvas px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      <Header />

      <main className="flex-1 bg-canvas py-8">
        {/* Breadcrumb & Navigation */}
        <div className="container-page border-b border-hairline-soft pb-4 mb-8 flex items-center justify-between text-xs text-mute">
          <nav className="flex items-center gap-2">
            <Link
              href={`/${countryCode}`}
              className="hover:text-ink transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/${countryCode}/shop`}
              className="hover:text-ink transition-colors"
            >
              Shop
            </Link>
            <span>/</span>
            <span className="text-ink font-medium truncate max-w-50 md:max-w-none">
              {dbProduct.title}
            </span>
          </nav>

          {/* Simple PDP pagination indicator */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${countryCode}/shop`}
              className="hover:text-ink flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="h-3 w-3" /> Back
            </Link>
            <span>|</span>
            <span className="font-semibold text-ink">Storefront</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 pb-16">
          <ProductGallery
            images={
              dbProduct.images?.map((img) => img.url!) ||
              [dbProduct.thumbnail!].filter(Boolean)
            }
            name={dbProduct.title || ""}
          />
          <SingleProductInfo product={dbProduct} /> 
                <ProductAccordions
        product={dbProduct}
        openAccordions={openAccordions}
        toggleAccordion={toggleAccordion}
      />
        </div>

        {/* Marquee Promotion Banner */}
        <div className="my-8">
          <PromoMarquee />
        </div>

        {/* Product Suggestions & Recently Viewed */}
        <div className="container-page space-y-8 mt-12">
          <RelatedProducts currentProductId={dbProduct.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
