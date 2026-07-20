import { Footer } from "@/feature/home/Footer";
import { Header } from "@/feature/home/Header";
import { ShopContent } from "@/feature/shop/ShopContent";
import { ShopSidebar } from "@/feature/shop/ShopSidebar";
import { listCategories } from "@lib/data/categories";
import { listProducts } from "@lib/data/products";
import { mapStoreProductToProduct } from "@lib/util/map-product";
import Link from "next/link";

async function getCategories() {
  try {
    return await listCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getProducts(countryCode: string, categoryId?: string) {
  try {
    const productsRes = await listProducts({
      countryCode,
      pageParam: 1,
      queryParams: {
        limit: 100,
        ...(categoryId ? { category_id: [categoryId] } : {}),
      },
    });
    return productsRes.response.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ShopPage(props: {
  params: Promise<{ countryCode: string }>;
  searchParams: Promise<{
    category?: string;
  }>;
}) {
  const { countryCode } = await props.params;
  const searchParams = await props.searchParams;
  const { category: activeCategoryId } = searchParams;

  const categories = await getCategories();
  const dbProducts = await getProducts(countryCode, activeCategoryId);
  const mappedProducts = dbProducts.map(mapStoreProductToProduct);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      <Header />

      <main className="flex-1 bg-canvas py-8">
        {/* Breadcrumbs */}
        <div className="container-page border-b border-hairline-soft pb-4 mb-8 text-xs text-mute">
          <nav className="flex items-center gap-2">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">Shop All</span>
          </nav>
        </div>

        {/* Shop Layout */}
        <div className="container-page flex flex-col lg:flex-row gap-10 pb-16">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0">
            <ShopSidebar categories={categories} />
          </div>

          {/* Main Product Area */}
          <ShopContent products={mappedProducts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
