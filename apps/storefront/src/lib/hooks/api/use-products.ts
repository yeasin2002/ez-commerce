import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productsApi } from "@lib/api/products";
import { useRegions } from "./use-regions";
import { useCollectionByHandle } from "./use-collections";

export const PRODUCT_KEYS = {
  all: () => ["products"] as const,
  lists: () => ["products", "list"] as const,
  list: (queryParams: Record<string, unknown>) =>
    ["products", "list", queryParams] as const,
  collection: (collectionHandle: string, queryParams: Record<string, unknown>) =>
    ["products", "collection", collectionHandle, queryParams] as const,
  detail: (id: string, queryParams?: Record<string, unknown>) =>
    ["products", "detail", id, queryParams] as const,
};

export const useProducts = (
  countryCode: string,
  categoryId?: string,
  collectionId?: string,
) => {
  const { data: regions } = useRegions();

  const region =
    regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === countryCode?.toLowerCase())) ||
    regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === "bd")) ||
    regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === "us")) ||
    regions?.[0];

  return useInfiniteQuery({
    queryKey: PRODUCT_KEYS.list({
      countryCode,
      categoryId,
      collectionId,
      regionId: region?.id,
    }),
    queryFn: ({ pageParam }) => {
      const offset = pageParam * 24;
      const queryParams: Record<string, unknown> = {
        limit: 24,
        offset,
        ...(region?.id ? { region_id: region.id } : {}),
        ...(categoryId ? { category_id: [categoryId] } : {}),
        ...(collectionId ? { collection_id: [collectionId] } : {}),
      };
      return productsApi.list(queryParams);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentCount = allPages.length * 24;
      return lastPage.count > currentCount ? allPages.length : null;
    },
    enabled: !!regions,
  });
};

export const useCollectionProducts = (
  countryCode: string,
  collectionHandle?: string,
  limit: number = 8,
) => {
  const { data: regions } = useRegions();
  const { data: collection, isLoading: isCollectionLoading } =
    useCollectionByHandle(collectionHandle || "");

  const region =
    regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === countryCode?.toLowerCase())) ||
    regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === "bd")) ||
    regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === "us")) ||
    regions?.[0];

  const query = useQuery({
    queryKey: PRODUCT_KEYS.collection(collectionHandle || "", {
      countryCode,
      regionId: region?.id,
      collectionId: collection?.id,
      limit,
    }),
    queryFn: async () => {
      if (!collection?.id) {
        return { products: [], count: 0 };
      }
      return productsApi.list({
        collection_id: [collection.id],
        limit,
        ...(region?.id ? { region_id: region.id } : {}),
      });
    },
    enabled: !!regions && !!collection?.id && !!collectionHandle,
  });

  return {
    ...query,
    isLoading: isCollectionLoading || (!!collectionHandle && query.isLoading),
    collection,
  };
};

export const useProduct = (id: string, countryCode?: string) => {
  const { data: regions } = useRegions();

  const region =
    regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === countryCode?.toLowerCase())) ||
    regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === "bd")) ||
    regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === "us")) ||
    regions?.[0];

  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id, { countryCode, regionId: region?.id }),
    queryFn: () =>
      productsApi.retrieve(
        id,
        region?.id ? { region_id: region.id } : undefined,
      ),
    enabled: !!id && !!regions,
  });
};
