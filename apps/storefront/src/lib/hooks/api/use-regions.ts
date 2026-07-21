import { useQuery } from "@tanstack/react-query";
import { regionsApi } from "@lib/api/regions";

const REGION_KEYS = {
  all: () => ["regions"] as const,
};

export const useRegions = () => {
  return useQuery({
    queryKey: REGION_KEYS.all(),
    queryFn: () => regionsApi.list().then((res) => res.regions),
  });
};
