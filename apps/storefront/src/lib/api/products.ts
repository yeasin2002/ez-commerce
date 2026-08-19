import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";

export const productsApi = {
  list: (queryParams?: Record<string, unknown>) =>
    sdk.client.fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,",
          ...queryParams,
        },
      },
    ),
  retrieve: async (id: string, queryParams?: Record<string, unknown>) => {
    const query = {
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags",
      ...queryParams,
    };

    try {
      return await sdk.client
        .fetch<{ product: HttpTypes.StoreProduct }>(`/store/products/${id}`, {
          method: "GET",
          query,
        })
        .then((res) => res.product);
    } catch (error) {
      // Fallback: search by handle
      const res = await sdk.client.fetch<{
        products: HttpTypes.StoreProduct[];
        count: number;
      }>(`/store/products`, {
        method: "GET",
        query: {
          ...query,
          handle: id,
          limit: 1,
        },
      });
      if (res.products && res.products.length > 0) {
        return res.products[0];
      }
      throw error;
    }
  },
};
