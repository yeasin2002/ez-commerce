"use client";

import { useAddToCart } from "@lib/hooks/api/use-cart";
import { getProductPrice } from "@lib/util/get-product-price";
import { getProductSoldCount, getProductViewingCount } from "@lib/util/product";
import { HttpTypes } from "@medusajs/types";
import { Check, Heart, HelpCircle, Loader2, Minus, Plus, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ProductAccordions } from "./product-accordions";
import ShippingAndDeliveryCard from "./shipping-and-delivery.card";

export function SingleProductInfo({
  product,
}: {
  product: HttpTypes.StoreProduct;
}) {
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "us";

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    product.options?.forEach((opt) => {
      if (opt.values?.[0]?.value) {
        initial[opt.id] = opt.values[0].value;
      }
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addToCartMutation = useAddToCart();

  // Commented out metadata players/patches for generic PDP
  // const players = getProductPlayers(product);
  // const patches = getProductPatches(product);
  const soldCount = getProductSoldCount(product);
  const viewingCount = getProductViewingCount(product);

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      description: true,
    },
  );

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Find active variant matching selected options
  const selectedVariant = product.variants?.find((v) =>
    v.options?.every((opt) => selectedOptions[opt.option_id!] === opt.value),
  );

  // Retrieve pricing for currently selected variant
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: selectedVariant?.id,
  });

  const activePrice = variantPrice || cheapestPrice;
  const currentPriceFormatted = activePrice?.calculated_price;
  const currentPrice = activePrice?.calculated_price_number ?? 0;
  const originalPriceFormatted = activePrice?.original_price;
  const originalPrice = activePrice?.original_price_number;
  const discountPercent = activePrice?.percentage_diff
    ? parseInt(activePrice.percentage_diff)
    : undefined;

  const hasDiscount = originalPrice ? originalPrice > currentPrice : false;

  const handleAddToCart = () => {
    if (!selectedVariant?.id) {
      setErrorMessage("Please select a valid variant option");
      return;
    }

    setErrorMessage(null);
    addToCartMutation.mutate(
      {
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      },
      {
        onSuccess: () => {
          setAddedToast(true);
          setTimeout(() => setAddedToast(false), 2500);
        },
        onError: (err: any) => {
          setErrorMessage(err?.message || "Failed to add item to cart");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 text-ink">
      {/* Badge & Title */}
      <div>
        <div className="flex items-center gap-3">
          {discountPercent ? (
            <span className="inline-flex items-center rounded-pill bg-sale px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-canvas">
              -{discountPercent}%
            </span>
          ) : null}
          <div className="flex items-center gap-1.5 text-xs text-sale font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sale opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sale"></span>
            </span>
            <span>{soldCount || 22} sold in last 10 hours</span>
          </div>
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl uppercase tracking-wide leading-tight">
          {product.title}
        </h1>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-sale">
          {currentPriceFormatted || `$${currentPrice.toFixed(2)}`}
        </span>
        {hasDiscount && (originalPriceFormatted || originalPrice) ? (
          <span className="text-lg text-mute line-through">
            {originalPriceFormatted || `$${originalPrice?.toFixed(2)}`}
          </span>
        ) : null}
      </div>

      <ShippingAndDeliveryCard />

      {/* Real-time viewers */}
      <div className="text-xs text-charcoal flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
        <span>{viewingCount || 35} people are viewing this right now</span>
      </div>

      {/* Dynamic Options Selector (Size, Color, etc.) */}
      {product.options?.map((opt) => {
        const selectedValue = selectedOptions[opt.id];
        return (
          <div key={opt.id} className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wide text-ink">
                {opt.title}: {selectedValue}
              </span>
              {opt.title?.toLowerCase() === "size" && (
                <button className="text-mute underline underline-offset-4 hover:text-ink">
                  Size guide
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {opt.values?.map((val) => {
                const isSelected = selectedValue === val.value;
                return (
                  <button
                    key={val.id}
                    onClick={() =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [opt.id]: val.value ?? "",
                      }))
                    }
                    className={`min-w-12 h-10 px-4 rounded-pill text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-ink border-ink text-canvas"
                        : "bg-canvas border-hairline-soft text-ink hover:border-ink"
                    }`}
                  >
                    {val.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Social Actions */}
      <div className="flex items-center gap-6 py-2 text-xs border-y border-hairline-soft">
        <button className="flex items-center gap-2 text-mute hover:text-ink">
          <HelpCircle className="h-4 w-4" />
          <span>Ask a question</span>
        </button>
        <button className="flex items-center gap-2 text-mute hover:text-ink">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Purchase Actions */}
      <div className="space-y-3 mt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex h-12 items-center rounded-pill bg-cloud px-4 border border-hairline-soft">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || addToCartMutation.isPending}
              className="p-1 text-mute hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              disabled={addToCartMutation.isPending}
              className="p-1 text-mute hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || !selectedVariant}
            className={`flex-1 h-12 rounded-pill text-xs font-semibold uppercase tracking-wider text-canvas transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              addedToast
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-ink hover:opacity-90"
            }`}
          >
            {addToCartMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding to Cart...</span>
              </>
            ) : addedToast ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span>Added to Cart!</span>
              </>
            ) : (
              "Add to Cart"
            )}
          </button>

          {/* Wishlist */}
          <button
            aria-label="Add to wishlist"
            className="flex h-12 w-12 items-center justify-center rounded-pill border border-hairline-soft bg-canvas text-ink hover:bg-cloud transition-colors"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-sale font-medium animate-in fade-in duration-200">
            {errorMessage}
          </p>
        )}

        {/* Buy with Shop */}
        <button className="w-full h-12 rounded-pill bg-[#5a31f4] text-xs font-bold uppercase tracking-wider text-canvas hover:opacity-90 transition-opacity">
          Buy with <span className="font-extrabold italic lowercase">shop</span>
        </button>

        {/* More options */}
        <button className="w-full text-center text-xs font-semibold underline underline-offset-4 hover:text-mute">
          More payment options
        </button>
      </div>

      {/* Accordions */}
      <ProductAccordions
        product={product}
        openAccordions={openAccordions}
        toggleAccordion={toggleAccordion}
      />
    </div>
  );
}
