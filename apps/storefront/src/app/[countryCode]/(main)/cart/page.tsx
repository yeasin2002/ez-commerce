"use client";

import React, { use, useState } from "react";
import Link from "next/link";
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
  Lock 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom premium SVG Shirt Icon for Jersey previews
const JerseyIcon = ({ 
  color, 
  collarColor = "#ffffff", 
  accentColor = "transparent" 
}: { 
  color: string; 
  collarColor?: string; 
  accentColor?: string; 
}) => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 select-none pointer-events-none drop-shadow-sm">
    <path 
      d="M 30 20 L 40 10 Q 50 15 60 10 L 70 20 L 88 28 L 82 46 L 72 42 L 72 90 L 28 90 L 28 42 L 18 46 L 12 28 Z" 
      fill={color} 
    />
    <path 
      d="M 40 10 Q 50 15 60 10 L 58 16 Q 50 20 42 16 Z" 
      fill={collarColor} 
    />
    {accentColor !== "transparent" && (
      <rect x="47" y="22" width="6" height="68" fill={accentColor} opacity="0.35" />
    )}
  </svg>
);

// Custom premium SVG Shorts Icon for apparel preview
const ShortsIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 select-none pointer-events-none drop-shadow-sm">
    <rect x="25" y="20" width="50" height="8" rx="2" fill="#222" />
    <path 
      d="M 25 28 L 75 28 L 80 75 L 53 75 L 50 55 L 47 75 L 20 75 Z" 
      fill={color} 
    />
    <path d="M 49 55 L 51 55 L 50 75 Z" fill="#111" opacity="0.4" />
  </svg>
);

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function CartPage({ params }: PageProps) {
  const { countryCode } = use(params);

  // Mock cart items state to support dynamic quantity changes and removals
  const [items, setItems] = useState([
    {
      id: "cart-item-1",
      name: "Manchester United Home Jersey 2024/25",
      size: "M",
      color: "Red",
      inStock: true,
      originalPrice: 2800,
      price: 2450,
      qty: 1,
      icon: <JerseyIcon color="#c21d24" collarColor="#ffffff" accentColor="#ffffff" />
    },
    {
      id: "cart-item-2",
      name: "Inter Miami Away Jersey 2024/25",
      size: "L",
      color: "Pink",
      inStock: true,
      originalPrice: 2450,
      price: 2150,
      qty: 1,
      icon: <JerseyIcon color="#fca5a5" collarColor="#000000" accentColor="#000000" />
    },
    {
      id: "cart-item-3",
      name: "Nike Dri-FIT Short Men's Training Shorts",
      size: "M",
      color: "Black",
      inStock: true,
      originalPrice: 1200,
      price: 950,
      qty: 1,
      icon: <ShortsIcon color="#18181b" />
    }
  ]);

  // Handle quantity adjustment
  const updateQty = (id: string, delta: number) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  // Handle item removal
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Calculation formulas matching the provided totals
  const subtotalOriginal = items.reduce((acc, item) => acc + (item.originalPrice * item.qty), 0);
  const subtotalDiscounted = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountTotal = subtotalOriginal - subtotalDiscounted;
  
  const shippingCost = items.length > 0 ? 80 : 0;
  const finalTotal = subtotalDiscounted + shippingCost;

  const freeShippingThreshold = 6000;
  const remainingForFreeShipping = freeShippingThreshold - finalTotal;
  const progressPercent = Math.min((finalTotal / freeShippingThreshold) * 100, 100);

  const formatCurrency = (val: number) => {
    return `৳ ${val.toLocaleString()}`;
  };

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
              {items.length} {items.length === 1 ? "item" : "items"} in your cart.
            </p>
          </div>

          {items.length > 0 ? (
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
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 md:p-6">
                      
                      {/* Product details info (Jersey, details, size, in stock) */}
                      <div className="col-span-12 md:col-span-6 flex gap-4">
                        <div className="w-16 h-16 bg-cloud/50 border border-hairline-soft rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {item.icon}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-bold text-ink leading-tight font-sans">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-mute font-sans">
                            Size: {item.size} &nbsp;•&nbsp; Color: {item.color}
                          </p>
                          {item.inStock && (
                            <span className="inline-block text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-sans border border-emerald-100">
                              In Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Prices (Single Item) */}
                      <div className="col-span-4 md:col-span-2 text-left md:text-center flex md:block items-baseline gap-2">
                        <span className="text-[10px] text-mute line-through block md:inline-block md:mb-0.5 font-sans">
                          {formatCurrency(item.originalPrice)}
                        </span>
                        <span className="text-xs font-bold text-sale block font-sans">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      {/* Quantity Selector + Remove Link */}
                      <div className="col-span-4 md:col-span-2 flex flex-col items-start md:items-center gap-1.5">
                        <div className="inline-flex items-center border border-hairline bg-canvas rounded-full h-8 overflow-hidden select-none">
                          <button 
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-cloud/50 text-ink/75 transition-colors cursor-pointer text-xs font-bold"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-sans text-ink">
                            {item.qty}
                          </span>
                          <button 
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-cloud/50 text-ink/75 transition-colors cursor-pointer text-xs font-bold"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button 
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-mute hover:text-sale transition-colors cursor-pointer font-sans"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Total Prices (Item multiplied by quantity) */}
                      <div className="col-span-4 md:col-span-2 text-right flex md:block items-baseline justify-end gap-2">
                        <span className="text-[10px] text-mute line-through block md:inline-block md:mb-0.5 font-sans">
                          {formatCurrency(item.originalPrice * item.qty)}
                        </span>
                        <span className="text-xs font-bold text-sale block font-sans">
                          {formatCurrency(item.price * item.qty)}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

              {/* Promo Code Box */}
              <div className="bg-canvas border border-hairline-soft rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-md w-full sm:w-auto">
                  <input 
                    type="text" 
                    placeholder="Enter coupon code" 
                    className="flex-1 sm:w-48 h-10 rounded-full border border-border bg-cloud/10 px-4 text-xs placeholder:text-mute focus:outline-none focus:border-ink transition-colors font-sans"
                  />
                  <Button 
                    type="button"
                    className="rounded-full bg-ink hover:bg-charcoal text-canvas px-5 py-2 h-10 text-xs font-semibold uppercase tracking-wider border-none cursor-pointer font-sans"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Items list Cleared fallback block */
            <div className="bg-canvas border border-hairline-soft rounded-xl p-8 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-cloud/80 text-mute flex items-center justify-center mx-auto">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-ink font-sans">Your cart is empty</h3>
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

          {/* Bottom Box empty cart template shown explicitly as mock decoration */}
          {items.length > 0 && (
            <div className="bg-canvas border border-hairline-soft rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 opacity-55 hover:opacity-100 transition-opacity mt-4 border-dashed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cloud/50 flex items-center justify-center text-mute">
                  <ShoppingBag className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink font-sans">
                    Your cart is empty
                  </h4>
                  <p className="text-[10px] text-mute mt-0.5 font-sans">
                    Looks like you haven&apos;t added anything to your cart yet.
                  </p>
                </div>
              </div>
              <Link href={`/${countryCode}/shop`}>
                <Button className="rounded-full bg-ink hover:bg-charcoal text-canvas px-5 py-2 text-xs font-semibold uppercase tracking-wider border-none cursor-pointer font-sans whitespace-nowrap">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}

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
                <span>Subtotal ({items.reduce((sum, i) => sum + i.qty, 0)} items)</span>
                <span className="font-semibold text-ink">{formatCurrency(subtotalOriginal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-sale">Discount</span>
                <span className="font-bold text-sale">-{formatCurrency(discountTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink/80 font-sans">
                <span>Shipping</span>
                <span className="font-semibold text-ink">{formatCurrency(shippingCost)}</span>
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
                        Free shipping on orders over {formatCurrency(freeShippingThreshold)}
                      </h4>
                      <p className="text-[10px] text-mute mt-0.5 font-sans leading-relaxed">
                        Add {formatCurrency(remainingForFreeShipping)} more to get free shipping!
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
                {formatCurrency(finalTotal)} / {formatCurrency(freeShippingThreshold)}
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
              <span><strong>100% Authentic Products</strong> &nbsp;Sourced from official brands</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink/80 font-sans">
              <Truck className="h-4 w-4 text-mute shrink-0" />
              <span><strong>Fast Delivery</strong> &nbsp;Delivery within 2-4 business days</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink/80 font-sans">
              <Lock className="h-4 w-4 text-mute shrink-0" />
              <span><strong>Safe & Secure Payments</strong> &nbsp;Powered by Stripe</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
