import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  retrieveCart,
  addToCart as serverAddToCart,
  updateLineItem as serverUpdateLineItem,
  deleteLineItem as serverDeleteLineItem,
  applyPromotions as serverApplyPromotions,
} from "@lib/data/cart";
import { HttpTypes } from "@medusajs/types";

export const CART_QUERY_KEY = ["cart"] as const;

export const useCart = () => {
  return useQuery<HttpTypes.StoreCart | null>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const cart = await retrieveCart();
      return cart;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      variantId,
      quantity = 1,
      countryCode,
    }: {
      variantId: string;
      quantity?: number;
      countryCode: string;
    }) => {
      await serverAddToCart({ variantId, quantity, countryCode });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useUpdateLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lineId,
      quantity,
    }: {
      lineId: string;
      quantity: number;
    }) => {
      await serverUpdateLineItem({ lineId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useDeleteLineItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lineId: string) => {
      await serverDeleteLineItem(lineId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useApplyPromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promoCode: string) => {
      await serverApplyPromotions([promoCode]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};
