"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Minus,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Change this to false to see the cart with items!
import {
  useCart,
  useUpdateLineItem,
  useDeleteLineItem,
} from "@lib/hooks/api/use-cart";
import { useParams } from "next/navigation";

const EmptyCartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-16 h-16 text-stone"
  >
    {/* Basket Handle */}
    <path d="M7 10C7 10 7 4 12 4C17 4 17 10 17 10" />
    {/* Basket Body */}
    <path d="M4 10H20L18.5 20C18.5 21 17.5 21.5 16.5 21.5H7.5C6.5 21.5 5.5 21 5.5 20L4 10Z" />
    {/* Eyes */}
    <circle cx="10" cy="14" r="0.75" fill="currentColor" />
    <circle cx="14" cy="14" r="0.75" fill="currentColor" />
    {/* Sad mouth */}
    <path d="M10.5 18C11 17.2 11.5 17 12 17C12.5 17 13 17.2 13.5 18" />
  </svg>
);

export const ShowCarts = () => {
  const params = useParams();
  const countryCode = (params?.countryCode as string) || "us";

  const { data: cart, isLoading } = useCart();
  const updateLineItem = useUpdateLineItem();
  const deleteLineItem = useDeleteLineItem();

  const items = cart?.items || [];
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart?.subtotal ?? 0;
  const currencyCode = (cart?.currency_code || "usd").toUpperCase();

  const handleUpdateQty = (lineId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      deleteLineItem.mutate(lineId);
    } else {
      updateLineItem.mutate({ lineId, quantity: newQty });
    }
  };

  const isCartEmpty = !isLoading && items.length === 0;

  return (
    <Sheet>
      <SheetTrigger className="relative flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-cloud focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink cursor-pointer">
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-pill bg-ink px-1 text-[10px] font-semibold text-canvas">
            {totalItems}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={true}
        className="w-full sm:max-w-110 flex flex-col p-0 bg-canvas border-l border-hairline"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-hairline-soft flex flex-row items-center justify-between">
          <SheetTitle className="text-lg font-semibold tracking-tight text-ink font-sans">
            Shopping Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {isCartEmpty ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-6 flex justify-center text-stone">
                <EmptyCartIcon />
              </div>
              <h3 className="text-base font-semibold text-ink mb-2 font-sans">
                Your cart is currently empty!
              </h3>
              <p className="text-xs text-mute max-w-[280px] mb-8 leading-relaxed font-sans">
                You may check out all the available products and buy some in the
                shop.
              </p>

              <SheetTrigger asChild>
                <Button className="bg-ink hover:bg-charcoal text-canvas rounded-pill px-8 py-2.5 text-sm font-semibold tracking-wide cursor-pointer font-sans">
                  Continue Shopping
                </Button>
              </SheetTrigger>
            </div>
          ) : (
            /* Populated State */
            <div className="flex-1 flex flex-col">
              <div className="flex-1 divide-y divide-dashed divide-hairline-soft">
                {items.map((item) => {
                  const thumbnail =
                    item.thumbnail ||
                    item.product?.thumbnail ||
                    "https://images.unsplash.com/photo-1541002442297-50348f9757e5?w=300&q=80";
                  const title = item.product_title || item.title || "Product";
                  const variantTitle = item.variant_title || item.variant?.title;

                  return (
                    <div key={item.id} className="p-6 flex gap-4 bg-canvas">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-cloud rounded-lg overflow-hidden shrink-0 border border-hairline-soft relative">
                        <Image
                          src={thumbnail}
                          alt={title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[14px] font-semibold text-ink leading-snug font-sans">
                            {title}
                          </h4>

                          {variantTitle && (
                            <div className="text-[11px] text-mute mt-1.5 leading-relaxed font-sans">
                              <span>Variant: {variantTitle}</span>
                            </div>
                          )}
                        </div>

                        {/* Quantity and Price Row */}
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-hairline-soft bg-cloud rounded-md overflow-hidden">
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity, -1)}
                              disabled={updateLineItem.isPending || deleteLineItem.isPending}
                              className="p-1 px-2.5 text-mute hover:text-ink transition-colors text-xs font-semibold cursor-pointer border-0 bg-transparent"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-1 text-xs font-medium text-ink w-6 text-center select-none font-sans">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity, 1)}
                              disabled={updateLineItem.isPending}
                              className="p-1 px-2.5 text-mute hover:text-ink transition-colors text-xs font-semibold cursor-pointer border-0 bg-transparent"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right flex flex-col">
                            <div className="space-x-1.5 font-sans">
                              <span className="text-[14px] font-bold text-sale">
                                ${item.unit_price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <div className="flex flex-col items-center justify-start gap-3 shrink-0 pt-0.5">
                        <button
                          onClick={() => deleteLineItem.mutate(item.id)}
                          disabled={deleteLineItem.isPending}
                          className="text-stone hover:text-sale transition-colors cursor-pointer border-0 bg-transparent"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isCartEmpty && (
          <div className="border-t border-hairline-soft bg-canvas shrink-0">
            {/* Tabs for Order Notes / Shipping */}
            <div className="flex border-b border-hairline-soft">
              <button className="flex-1 py-3.5 flex justify-center items-center gap-2 text-xs font-medium border-r border-hairline-soft text-charcoal hover:bg-cloud/50 transition-colors cursor-pointer font-sans border-0 bg-transparent">
                <Calendar className="w-4 h-4" />
                <span>Add Note</span>
              </button>
              <button className="flex-1 py-3.5 flex justify-center items-center gap-2 text-xs font-medium text-charcoal hover:bg-cloud/50 transition-colors cursor-pointer font-sans border-0 bg-transparent">
                <Package className="w-4 h-4" />
                <span>Calculate Shipping</span>
              </button>
            </div>

            {/* Subtotal & Checkout */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-base font-bold text-ink font-sans">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)} {currencyCode}</span>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link
                  href={`/${countryCode}/cart`}
                  className={cn(
                    "w-full border border-black text-ink hover:bg-cloud rounded-pill py-4 font-semibold text-[14px] cursor-pointer font-sans text-center block",
                  )}
                >
                  View Cart
                </Link>

                <Link
                  href={`/${countryCode}/checkout`}
                  className="w-full"
                >
                  <Button className="w-full bg-ink text-canvas hover:bg-charcoal rounded-pill py-5 font-semibold text-[14px] cursor-pointer font-sans">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
