import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const regionsApi = {
  list: () =>
    sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
    }),
}
