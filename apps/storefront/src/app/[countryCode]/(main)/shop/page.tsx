import { ALL_PRODUCTS } from "@/data/products.data";
import { Footer } from "@/feature/home/Footer";
import { Header } from "@/feature/home/Header";
import { ShopGrid } from "@/feature/shop/ShopGrid";
import { ShopSidebar } from "@/feature/shop/ShopSidebar";
import { ShopToolbar } from "@/feature/shop/ShopToolbar";
import Link from "next/link";

export default function ShopPage() {
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
          <div className="w-full lg:w-64 flex-shrink-0">
            <ShopSidebar />
          </div>

          {/* Main Product Area */}
          <div className="flex-1">
            <ShopToolbar />
            <ShopGrid products={ALL_PRODUCTS} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
