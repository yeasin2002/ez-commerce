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
};
