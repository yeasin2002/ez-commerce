import { useQuery } from "@tanstack/react-query"
import { productsApi } from "@lib/api/products"
import { useRegions } from "./use-regions"

const PRODUCT_KEYS = {
  all: () => ["products"] as const,
  lists: () => ["products", "list"] as const,
  list: (queryParams: Record<string, unknown>) => ["products", "list", queryParams] as const,
}

export const useProducts = (countryCode: string, categoryId?: string) => {
  const { data: regions } = useRegions()

  const region =
    regions?.find((r) => r.countries?.some((c) => c?.iso_2 === countryCode)) ||
    regions?.find((r) => r.countries?.some((c) => c?.iso_2 === "us"))

  const queryParams = {
    limit: 100,
    ...(region?.id ? { region_id: region.id } : {}),
    ...(categoryId ? { category_id: [categoryId] } : {}),
  }

  return useQuery({
    queryKey: PRODUCT_KEYS.list(queryParams),
    queryFn: () => productsApi.list(queryParams).then((res) => res.products),
    enabled: !!regions,
  })
}
