"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Minus,
  Trash2,
  Tag,
  ShieldCheck,
  RefreshCw,
  Headphones,
  ShoppingBag,
  Truck,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCart,
  useUpdateLineItem,
  useDeleteLineItem,
  useApplyPromotion,
} from "@lib/hooks/api/use-cart";
import { convertToLocale } from "@lib/util/money";

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function CartPage({ params }: PageProps) {
  const { countryCode } = use(params);

  const { data: cart, isLoading } = useCart();
  const updateLineItem = useUpdateLineItem();
  const deleteLineItem = useDeleteLineItem();
  const applyPromotion = useApplyPromotion();

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  const items = cart?.items || [];
  const currencyCode = cart?.currency_code || "usd";

  const handleUpdateQty = (lineId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      deleteLineItem.mutate(lineId);
    } else {
      updateLineItem.mutate({ lineId, quantity: newQty });
    }
  };

  const handleRemoveItem = (lineId: string) => {
    deleteLineItem.mutate(lineId);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    setPromoError(null);
    applyPromotion.mutate(promoCodeInput.trim(), {
      onError: (err: any) => {
        setPromoError(err?.message || "Failed to apply promotion code");
      },
      onSuccess: () => {
        setPromoCodeInput("");
      },
    });
  };

  // Cart Calculations
  const subtotal = cart?.subtotal ?? 0;
  const discountTotal = cart?.discount_total ?? 0;
  const shippingCost = cart?.shipping_total ?? 0;
  const finalTotal = cart?.total ?? subtotal;

  const freeShippingThreshold = 100; // Free shipping on orders over $100
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - finalTotal);
  const progressPercent = Math.min(
    (finalTotal / freeShippingThreshold) * 100,
    100,
  );

  const formatCurrency = (val: number) => {
    return convertToLocale({ amount: val, currency_code: currencyCode });
  };

  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Cart Items Listing */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Header Title */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-display font-normal uppercase tracking-wider text-ink">
              Your Cart
            </h1>
            <p className="text-xs text-mute mt-1 font-sans">
              {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} in your
              cart.
            </p>
          </div>

          {isLoading ? (
            <div className="bg-canvas border border-hairline-soft rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-mute" />
              <p className="text-xs text-mute font-sans">Loading cart items...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-4">
              {/* Product Listing Card/Table */}
              <div className="bg-canvas border border-hairline-soft rounded-xl overflow-hidden">
                {/* Desktop Headers */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-cloud/20 border-b border-hairline-soft text-[11px] font-bold uppercase tracking-wider text-mute font-sans">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-hairline-soft/60">
                  {items.map((item) => {
                    const thumbnail =
                      item.thumbnail ||
                      item.product?.thumbnail ||
                      "https://images.unsplash.com/photo-1541002442297-50348f9757e5?w=300&q=80";
                    const title = item.product_title || item.title || "Product";
                    const variantTitle = item.variant_title || item.variant?.title;
                    const itemTotal = item.total ?? item.unit_price * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 md:p-6"
                      >
                        {/* Product details info */}
                        <div className="col-span-12 md:col-span-6 flex gap-4">
                          <div className="w-16 h-16 bg-cloud/50 border border-hairline-soft rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                            <Image
                              src={thumbnail}
                              alt={title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-sm font-bold text-ink leading-tight font-sans">
                              {title}
                            </h3>
                            {variantTitle && (
                              <p className="text-[11px] text-mute font-sans">
                                Variant: {variantTitle}
                              </p>
                            )}
                            <span className="inline-block text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-sans border border-emerald-100">
                              In Stock
                            </span>
                          </div>
                        </div>

                        {/* Price (Single Item) */}
                        <div className="col-span-4 md:col-span-2 text-left md:text-center flex md:block items-baseline gap-2">
                          <span className="text-xs font-bold text-ink block font-sans">
                            {formatCurrency(item.unit_price)}
                          </span>
                        </div>

                        {/* Quantity Selector + Remove Link */}
                        <div className="col-span-4 md:col-span-2 flex flex-col items-start md:items-center gap-1.5">
                          <div className="inline-flex items-center border border-hairline bg-canvas rounded-full h-8 overflow-hidden select-none">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, item.quantity, -1)}
                              disabled={updateLineItem.isPending || deleteLineItem.isPending}
                              className="w-8 h-full flex items-center justify-center hover:bg-cloud/50 text-ink/75 transition-colors cursor-pointer text-xs font-bold border-0 bg-transparent"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold font-sans text-ink">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, item.quantity, 1)}
                              disabled={updateLineItem.isPending}
                              className="w-8 h-full flex items-center justify-center hover:bg-cloud/50 text-ink/75 transition-colors cursor-pointer text-xs font-bold border-0 bg-transparent"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={deleteLineItem.isPending}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-mute hover:text-sale transition-colors cursor-pointer font-sans border-0 bg-transparent"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Total Price for line item */}
                        <div className="col-span-4 md:col-span-2 text-right flex md:block items-baseline justify-end gap-2">
                          <span className="text-xs font-bold text-sale block font-sans">
                            {formatCurrency(itemTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Promo Code Box */}
              <form
                onSubmit={handleApplyPromo}
                className="bg-canvas border border-hairline-soft rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cloud/50 flex items-center justify-center text-ink/70">
                    <Tag className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink font-sans">
                      Have a promo code?
                    </h4>
                    <p className="text-[10px] text-mute mt-0.5 font-sans">
                      Enter it here to apply discount
                    </p>
                    {promoError && (
                      <p className="text-[10px] text-sale font-medium mt-1 font-sans">
                        {promoError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-md w-full sm:w-auto">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 sm:w-48 h-10 rounded-full border border-border bg-cloud/10 px-4 text-xs placeholder:text-mute focus:outline-none focus:border-ink transition-colors font-sans"
                  />
                  <Button
                    type="submit"
                    disabled={applyPromotion.isPending || !promoCodeInput.trim()}
                    className="rounded-full bg-ink hover:bg-charcoal text-canvas px-5 py-2 h-10 text-xs font-semibold uppercase tracking-wider border-none cursor-pointer font-sans flex items-center gap-1.5"
                  >
                    {applyPromotion.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* Empty Cart State */
            <div className="bg-canvas border border-hairline-soft rounded-xl p-8 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-cloud/80 text-mute flex items-center justify-center mx-auto">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-ink font-sans">
                  Your cart is empty
                </h3>
                <p className="text-xs text-mute font-sans max-w-sm mx-auto leading-relaxed">
                  Looks like you haven&apos;t added anything to your cart yet.
                </p>
              </div>
              <Link href={`/${countryCode}/shop`} className="inline-block">
                <Button className="rounded-full bg-ink hover:bg-charcoal text-canvas px-6 py-2.5 text-xs font-semibold uppercase tracking-wider border-none cursor-pointer font-sans">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}

          {/* Trust Badges row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-8 border-t border-hairline-soft">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-cloud rounded-lg text-ink/80">
                <ShieldCheck className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink uppercase tracking-wide font-sans">
                  Secure Checkout
                </h4>
                <p className="text-[10px] text-mute mt-0.5 font-sans leading-relaxed">
                  Your data is encrypted
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-cloud rounded-lg text-ink/80">
                <RefreshCw className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink uppercase tracking-wide font-sans">
                  Easy Returns
                </h4>
                <p className="text-[10px] text-mute mt-0.5 font-sans leading-relaxed">
                  30-day return policy
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-cloud rounded-lg text-ink/80">
                <Headphones className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink uppercase tracking-wide font-sans">
                  Customer Support
                </h4>
                <p className="text-[10px] text-mute mt-0.5 font-sans leading-relaxed">
                  We&apos;re here to help
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary Card */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-canvas border border-hairline-soft rounded-xl p-6">
            {/* Header */}
            <div className="border-b border-hairline-soft pb-4">
              <h2 className="text-2xl font-display font-normal uppercase tracking-wider text-ink">
                Order Summary
              </h2>
            </div>

            {/* Calculations Breakdown */}
            <div className="py-4 space-y-3 border-b border-hairline-soft">
              <div className="flex items-center justify-between text-xs text-ink/80 font-sans">
                <span>
                  Subtotal ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
                </span>
                <span className="font-semibold text-ink">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discountTotal > 0 && (
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-sale">Discount</span>
                  <span className="font-bold text-sale">
                    -{formatCurrency(discountTotal)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-ink/80 font-sans">
                <span>Shipping</span>
                <span className="font-semibold text-ink">
                  {shippingCost > 0 ? formatCurrency(shippingCost) : "Free"}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink font-sans">
                  Total
                </span>
                <span className="block text-[9px] text-mute font-sans mt-0.5 leading-none">
                  Inclusive of VAT
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold tracking-tight text-ink font-sans">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            {/* Free Shipping Progress bar */}
            <div className="bg-cloud/20 border border-hairline-soft/80 rounded-xl p-4 mt-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0f766e]/10 text-[#0f766e] flex items-center justify-center shrink-0">
                  <Truck className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  {finalTotal >= freeShippingThreshold ? (
                    <>
                      <h4 className="text-xs font-bold text-ink font-sans">
                        You&apos;re eligible for free shipping!
                      </h4>
                      <p className="text-[10px] text-mute mt-0.5 font-sans leading-relaxed">
                        Free shipping has been applied to your order.
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="text-xs font-bold text-ink font-sans">
                        Free shipping on orders over{" "}
                        {formatCurrency(freeShippingThreshold)}
                      </h4>
                      <p className="text-[10px] text-mute mt-0.5 font-sans leading-relaxed">
                        Add {formatCurrency(remainingForFreeShipping)} more to
                        get free shipping!
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="w-full h-1.5 bg-cloud rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-[#0f766e] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-end text-[9px] font-bold text-mute mt-1.5 font-sans tracking-wide">
                {formatCurrency(finalTotal)} /{" "}
                {formatCurrency(freeShippingThreshold)}
              </div>
            </div>

            {/* PROCEED TO CHECKOUT Pill Button */}
            <div className="mt-6">
              <Link href={`/${countryCode}/checkout`} className="w-full block">
                <Button
                  disabled={items.length === 0}
                  className="w-full rounded-full bg-ink hover:bg-charcoal text-canvas py-4 text-xs font-bold uppercase tracking-wider border-none cursor-pointer font-sans h-12 flex items-center justify-center"
                >
                  Proceed to Checkout
                </Button>
              </Link>
            </div>

            {/* Accept Cards badging */}
            <div className="mt-5 border-t border-hairline-soft pt-4 flex flex-col items-center gap-3">
              <span className="text-[10px] text-mute font-bold uppercase tracking-wide font-sans">
                We Accept
              </span>
              <div className="flex gap-1.5">
                <div className="w-8 h-5 rounded border border-hairline bg-canvas flex items-center justify-center text-[7px] font-bold text-blue-800 tracking-wider font-sans select-none italic shrink-0">
                  VISA
                </div>
                <div className="w-8 h-5 rounded border border-hairline bg-canvas flex items-center justify-center gap-0.5 select-none shrink-0 overflow-hidden">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#eb001b] -mr-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f00] opacity-90" />
                </div>
                <div className="w-8 h-5 rounded border border-hairline bg-[#017cc2] flex items-center justify-center text-[6px] font-extrabold text-canvas tracking-wider font-sans select-none shrink-0">
                  AMEX
                </div>
                <div className="w-8 h-5 rounded border border-hairline bg-canvas flex items-center justify-center text-[7px] font-semibold text-blue-900 tracking-tighter font-sans select-none shrink-0">
                  Diners
                </div>
              </div>
            </div>
          </div>

          {/* Secure details points list */}
          <div className="space-y-3.5 px-2">
            <div className="flex items-center gap-3 text-xs text-ink/80 font-sans">
              <ShieldCheck className="h-4 w-4 text-mute shrink-0" />
              <span>
                <strong>100% Authentic Products</strong> &nbsp;Sourced from
                official brands
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink/80 font-sans">
              <Truck className="h-4 w-4 text-mute shrink-0" />
              <span>
                <strong>Fast Delivery</strong> &nbsp;Delivery within 2-4
                business days
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink/80 font-sans">
              <Lock className="h-4 w-4 text-mute shrink-0" />
              <span>
                <strong>Safe & Secure Payments</strong> &nbsp;Powered by Stripe
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
