import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@lib/api/categories";

const CATEGORY_KEYS = {
  all: () => ["categories"] as const,
  lists: () => ["categories", "list"] as const,
  list: (queryParams?: Record<string, unknown>) =>
    ["categories", "list", queryParams] as const,
};

export const useCategories = (queryParams?: Record<string, unknown>) => {
  return useQuery({
    queryKey: CATEGORY_KEYS.list(queryParams),
    queryFn: () =>
      categoriesApi.list(queryParams).then((res) => res.product_categories),
  });
};
