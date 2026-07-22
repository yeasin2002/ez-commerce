import { HttpTypes } from "@medusajs/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/feature/home/Footer";
import { Header } from "@/feature/home/Header";
import { ProductGallery } from "@/feature/shop/ProductGallery";
import { ProductInfo } from "@/feature/shop/ProductInfo";
import { PromoMarquee } from "@/feature/shop/PromoMarquee";
import { RelatedProducts } from "@/feature/shop/RelatedProducts";
import { retrieveProduct } from "@lib/data/products";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string }>;
}) {
  const { id, countryCode } = await params;
  let dbProduct: HttpTypes.StoreProduct | null = null;

  try {
    dbProduct = await retrieveProduct(id, countryCode);
  } catch (error) {
    console.error("Error retrieving product:", error);
    notFound();
  }

  if (!dbProduct) return notFound();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      <Header />

      <main className="flex-1 bg-canvas py-8">
        {/* Breadcrumb & Navigation */}
        <div className="container-page border-b border-hairline-soft pb-4 mb-8 flex items-center justify-between text-xs text-mute">
          <nav className="flex items-center gap-2">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink font-medium truncate max-w-50 md:max-w-none">
              {dbProduct.title}
            </span>
          </nav>

          {/* Simple PDP pagination indicator */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
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
              dbProduct.images?.map((img) => img.url!) || [dbProduct.thumbnail!]
            }
            name={dbProduct.title || ""}
          />
          <ProductInfo product={dbProduct} />
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
