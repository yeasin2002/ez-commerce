import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";

export const collectionsApi = {
  list: (queryParams?: Record<string, unknown>) =>
    sdk.client.fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        method: "GET",
        query: queryParams,
      },
    ),

  retrieve: async (id: string, queryParams?: Record<string, unknown>) =>
    sdk.client
      .fetch<{ collection: HttpTypes.StoreCollection }>(
        `/store/collections/${id}`,
        {
          method: "GET",
          query: queryParams,
        },
      )
      .then((res) => res.collection),

  getByHandle: async (handle: string) => {
    const res = await sdk.client.fetch<{
      collections: HttpTypes.StoreCollection[];
      count: number;
    }>("/store/collections", {
      method: "GET",
      query: { handle, limit: 1 },
    });
    return res.collections?.[0] || null;
  },
};
