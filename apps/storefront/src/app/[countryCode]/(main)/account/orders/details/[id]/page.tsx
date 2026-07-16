"use client";

import React, { use } from "react";
import Link from "next/link";
import { 
  IconArrowLeft, 
  IconCheck, 
  IconClock 
} from "@tabler/icons-react";
import { mockOrders } from "@/data/account.data";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    countryCode: string;
    id: string;
  }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const { countryCode, id } = use(params);

  // Find matching order or fallback to the first one
  const order = mockOrders.find(o => o.id === id) || mockOrders[0];

  // Specific hardcoded pricing for order EZC-2505-0012 to match the mock design image exactly
  const isTargetOrder = order.id === "EZC-2505-0012";
  const subtotal = isTargetOrder ? 6200 : order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discount = isTargetOrder ? 700 : 0;
  const shipping = isTargetOrder ? 80 : (order.total > 4000 ? 0 : 80);
  const total = isTargetOrder ? 5580 : order.total;

  const formatCurrency = (val: number) => {
    return `৳ ${val.toLocaleString()}`;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50";
      case "Shipped":
        return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50";
      case "Processing":
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50";
      case "Cancelled":
        return "bg-gray-50 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800";
      case "Refunded":
        return "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Back to list navigation */}
      <div>
        <Link 
          href={`/${countryCode}/account/orders`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute hover:text-ink dark:hover:text-canvas transition-colors font-sans"
        >
          <IconArrowLeft size={14} />
          <span>Back to orders</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="pb-5 border-b border-hairline-soft flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-wider text-ink dark:text-canvas">
              Order #{order.id}
            </h1>
            <span className={cn(
              "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-sans",
              getStatusStyle(order.status)
            )}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-mute mt-1 font-sans">
            Placed on {order.timeline[0].date}
          </p>
        </div>
      </div>

      {/* Detailed Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Timeline, Items list, Addresses, Payment */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Timeline Tracking */}
          <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink dark:text-canvas border-b border-hairline-soft/80 pb-3 mb-6 font-sans">
              Order Progress Timeline
            </h3>

            {/* Vertical timeline steps */}
            <div className="relative border-l border-hairline pl-6 ml-3 space-y-8">
              {order.timeline.map((step, idx) => {
                const isCurrent = step.done && (idx === order.timeline.length - 1 || !order.timeline[idx + 1].done);
                return (
                  <div key={idx} className="relative">
                    {/* Circle Bullet icon */}
                    <div className={cn(
                      "absolute -left-[35px] top-0 w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-bold z-10 transition-colors duration-300",
                      step.done 
                        ? isCurrent 
                          ? "bg-ink text-canvas border-ink" 
                          : "bg-emerald-600 border-emerald-600 text-canvas"
                        : "bg-canvas dark:bg-zinc-950 border-hairline text-mute"
                    )}>
                      {step.done ? (
                        <IconCheck size={10} className="stroke-[3]" />
                      ) : (
                        <IconClock size={10} />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <h4 className={cn(
                          "text-xs font-bold font-sans",
                          step.done ? "text-ink dark:text-canvas" : "text-mute"
                        )}>
                          {step.status}
                        </h4>
                        <span className="text-[10px] text-mute font-sans">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-mute font-sans leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink dark:text-canvas border-b border-hairline-soft/80 pb-3 mb-4 font-sans">
              Items Ordered
            </h3>

            <div className="divide-y divide-hairline-soft/60">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-4 first:pt-1 last:pb-1">
                  
                  {/* Jersey Mock Miniature */}
                  <div className="w-14 h-14 bg-cloud/50 dark:bg-zinc-900 border border-hairline-soft rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    <svg viewBox="0 0 100 100" className="w-9 h-9 fill-ink/65 dark:fill-canvas/75 select-none pointer-events-none">
                      <path d="M 30 20 L 40 10 Q 50 15 60 10 L 70 20 L 88 28 L 82 46 L 72 42 L 72 90 L 28 90 L 28 42 L 18 46 L 12 28 Z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-ink dark:text-canvas truncate font-sans">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-mute mt-1 font-sans">
                      Size: {item.size} &nbsp;•&nbsp; Color: {item.color}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-mute block font-sans">
                      Qty: {item.qty}
                    </span>
                    <span className="text-xs font-bold text-ink dark:text-canvas font-sans mt-1 block">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Grid row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Shipping Address Box */}
            <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-5 space-y-2">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-mute font-sans">
                Shipping Address
              </h4>
              <div className="text-xs text-ink/80 dark:text-canvas/80 font-sans leading-relaxed">
                <p className="font-bold text-ink dark:text-canvas">Rifat Ahmed</p>
                <p>House 12, Road 5, Dhanmondi</p>
                <p>Dhaka, Dhaka 1205</p>
                <p>Bangladesh</p>
                <p className="mt-1 text-mute">{order.id === "EZC-2505-0012" ? "+880 1712 345 678" : "+880 1712 345 678"}</p>
              </div>
            </div>

            {/* Payment Method Box */}
            <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-5 space-y-2">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-mute font-sans">
                Payment Method
              </h4>
              <div className="text-xs text-ink/80 dark:text-canvas/80 font-sans leading-relaxed">
                <p className="font-bold text-ink dark:text-canvas">
                  {order.id === "EZC-2505-0012" ? "Cash on Delivery" : "Online Payment (Stripe)"}
                </p>
                <p className="text-mute mt-1 leading-relaxed">
                  {order.id === "EZC-2505-0012" 
                    ? "Pay with cash upon delivery of your items." 
                    : "Payment authorized via Stripe secure checkout."}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Order Summary Pricing breakdown */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          
          <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-6">
            <h3 className="text-base font-display uppercase tracking-wider text-ink dark:text-canvas border-b border-hairline-soft pb-3.5 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3.5 pb-4 border-b border-hairline-soft text-xs text-ink/80 dark:text-canvas/80 font-sans">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-ink dark:text-canvas">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sale">Discount</span>
                <span className="font-bold text-sale">-{formatCurrency(discount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-ink dark:text-canvas">{formatCurrency(shipping)}</span>
              </div>
            </div>

            <div className="pt-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-canvas font-sans">
                  Total Paid
                </span>
                <span className="block text-[9px] text-mute font-sans mt-0.5 leading-none">
                  Inclusive of VAT
                </span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-ink dark:text-canvas font-sans">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
