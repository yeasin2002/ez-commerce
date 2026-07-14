import { getProductById } from "@/data/products.data";
import { Header } from "@/feature/home/Header";
import { Footer } from "@/feature/home/Footer";
import { ProductGallery } from "@/feature/shop/ProductGallery";
import { ProductInfo } from "@/feature/shop/ProductInfo";
import { PromoMarquee } from "@/feature/shop/PromoMarquee";
import { RelatedProducts } from "@/feature/shop/RelatedProducts";
import { RecentlyViewed } from "@/feature/shop/RecentlyViewed";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

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
            <span className="text-ink font-medium truncate max-w-[200px] md:max-w-none">
              {product.name}
            </span>
          </nav>

          {/* Simple PDP pagination indicator */}
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-ink flex items-center gap-1 transition-colors">
              <ChevronLeft className="h-3 w-3" /> Back
            </Link>
            <span>|</span>
            <span className="font-semibold text-ink">Storefront</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 pb-16">
          <ProductGallery images={product.images || [product.image]} name={product.name} />
          <ProductInfo product={product} />
        </div>

        {/* Marquee Promotion Banner */}
        <div className="my-8">
          <PromoMarquee />
        </div>

        {/* Product Suggestions & Recently Viewed */}
        <div className="container-page space-y-8 mt-12">
          <RelatedProducts currentProductId={product.id} />
          <RecentlyViewed currentProductId={product.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
