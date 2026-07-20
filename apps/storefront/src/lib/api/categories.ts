import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const categoriesApi = {
  list: (queryParams?: Record<string, unknown>) =>
    sdk.client.fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        method: "GET",
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit: 100,
          ...queryParams,
        },
      }
    ),
}
