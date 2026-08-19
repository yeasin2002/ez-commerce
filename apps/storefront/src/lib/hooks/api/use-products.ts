import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productsApi } from "@lib/api/products";
import { useRegions } from "./use-regions";

const PRODUCT_KEYS = {
  all: () => ["products"] as const,
  lists: () => ["products", "list"] as const,
  list: (queryParams: Record<string, unknown>) =>
    ["products", "list", queryParams] as const,
  detail: (id: string, queryParams?: Record<string, unknown>) =>
    ["products", "detail", id, queryParams] as const,
};

export const useProducts = (countryCode: string, categoryId?: string) => {
  const { data: regions } = useRegions();

  const region =
    regions?.find((r) => r.countries?.some((c) => c?.iso_2 === countryCode)) ||
    regions?.find((r) => r.countries?.some((c) => c?.iso_2 === "us")) ||
    regions?.[0];

  return useInfiniteQuery({
    queryKey: PRODUCT_KEYS.list({
      countryCode,
      categoryId,
      regionId: region?.id,
    }),
    queryFn: ({ pageParam }) => {
      const offset = pageParam * 24;
      const queryParams = {
        limit: 24,
        offset,
        ...(region?.id ? { region_id: region.id } : {}),
        ...(categoryId ? { category_id: [categoryId] } : {}),
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

export const useProduct = (id: string, countryCode?: string) => {
  const { data: regions } = useRegions();

  const region =
    regions?.find((r) => r.countries?.some((c) => c?.iso_2 === countryCode)) ||
    regions?.find((r) => r.countries?.some((c) => c?.iso_2 === "us")) ||
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
