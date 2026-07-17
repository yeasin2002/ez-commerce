import { HttpTypes } from "@medusajs/types";
import { type Product } from "@/feature/home/ProductCard";
import { getProductPrice } from "./get-product-price";

export function mapStoreProductToProduct(
  product: HttpTypes.StoreProduct,
): Product {
  const { cheapestPrice } = getProductPrice({ product });

  return {
    id: product.id!,
    handle: product.handle || undefined,
    name: product.title || "",
    team:
      (product.metadata?.team as string) || product.subtitle || "Sportswear",
    price: cheapestPrice?.calculated_price_number ?? 0,
    original: cheapestPrice?.original_price_number ?? undefined,
    discount: cheapestPrice?.percentage_diff
      ? parseInt(cheapestPrice.percentage_diff)
      : undefined,
    image: product.thumbnail || "",
    tag: product.subtitle || undefined,
    description: product.description || undefined,
    images: product.images?.map((img) => img.url) || [],
    soldCount: (product.metadata?.sold_count as number) || 0,
  };
}
