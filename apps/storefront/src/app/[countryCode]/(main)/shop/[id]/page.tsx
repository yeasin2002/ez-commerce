import { retrieveProduct } from "@lib/data/products";
import { getProductPrice } from "@lib/util/get-product-price";
import { HttpTypes } from "@medusajs/types";
import { Footer } from "@/feature/home/Footer";
import { Header } from "@/feature/home/Header";
import { ProductGallery } from "@/feature/shop/ProductGallery";
import { ProductInfo } from "@/feature/shop/ProductInfo";
import { PromoMarquee } from "@/feature/shop/PromoMarquee";
import { RecentlyViewed } from "@/feature/shop/RecentlyViewed";
import { RelatedProducts } from "@/feature/shop/RelatedProducts";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function mapStoreProductToPDPProduct(product: HttpTypes.StoreProduct) {
  const { cheapestPrice } = getProductPrice({ product });

  const sizeOption = product.options?.find(
    (o) => o.title?.toLowerCase() === "size"
  );
  const sizes = sizeOption?.values?.map((v) => v.value).filter(Boolean) as string[] || [];

  const rawDetails = product.metadata?.details;
  const details = Array.isArray(rawDetails) ? rawDetails.map(String) : undefined;

  const rawPlayers = product.metadata?.players;
  const players = Array.isArray(rawPlayers)
    ? rawPlayers.map((p: any) => ({
        name: typeof p === "object" && p ? String(p.name || "") : String(p),
        label: typeof p === "object" && p ? String(p.label || p.name || "") : String(p),
      }))
    : undefined;

  const rawPatches = product.metadata?.patches;
  const patches = Array.isArray(rawPatches) ? rawPatches.map(String) : undefined;

  return {
    id: product.id!,
    name: product.title || "",
    team: (product.metadata?.team as string) || product.subtitle || "Sportswear",
    price: cheapestPrice?.calculated_price_number ?? 0,
    original: cheapestPrice?.original_price_number ?? undefined,
    discount: cheapestPrice?.percentage_diff
      ? parseInt(cheapestPrice.percentage_diff)
      : undefined,
    image: product.thumbnail || "",
    tag: product.subtitle || undefined,
    description: product.description || undefined,
    images: product.images?.map((img) => img.url) || [],
    sizes,
    details,
    players,
    patches,
    soldCount: (product.metadata?.sold_count as number) || undefined,
    viewingCount: (product.metadata?.viewing_count as number) || undefined,
  };
}

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

  if (!dbProduct) {
    notFound();
  }

  const product = mapStoreProductToPDPProduct(dbProduct);

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
            images={product.images || [product.image]}
            name={product.name}
          />
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
