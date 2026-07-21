"use client";

import React, { use } from "react";
import Link from "next/link";
import { mockOrders } from "@/data/account.data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function OrderHistoryPage({ params }: PageProps) {
  const { countryCode } = use(params);

  // Formatting helper
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
    <div className="space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-hairline-soft">
        <h1 className="text-4xl font-display uppercase tracking-wider text-ink dark:text-canvas">
          Order History
        </h1>
        <p className="text-xs text-mute mt-1 font-sans">
          View and track all your orders.
        </p>
      </div>

      {/* Orders Table Container */}
      <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl overflow-hidden">
        {/* Table Headers (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-cloud/20 dark:bg-zinc-900/40 border-b border-hairline-soft text-[11px] font-bold uppercase tracking-wider text-mute font-sans">
          <div className="col-span-3">Order</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Orders rows list */}
        <div className="divide-y divide-hairline-soft/60">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 md:p-6 hover:bg-cloud/5 dark:hover:bg-zinc-900/10 transition-colors"
            >
              {/* Column 1: Order ID */}
              <div className="col-span-12 md:col-span-3 flex items-center justify-between md:block">
                <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-mute font-sans">
                  Order ID
                </span>
                <span className="text-xs font-bold text-ink dark:text-canvas font-sans">
                  #{order.id}
                </span>
              </div>

              {/* Column 2: Date */}
              <div className="col-span-12 md:col-span-3 flex items-center justify-between md:block">
                <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-mute font-sans">
                  Date
                </span>
                <span className="text-xs text-ink/80 dark:text-canvas/80 font-sans">
                  {order.date}
                </span>
              </div>

              {/* Column 3: Status badge */}
              <div className="col-span-12 md:col-span-2 flex items-center justify-between md:block">
                <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-mute font-sans">
                  Status
                </span>
                <span
                  className={cn(
                    "inline-block text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-sans",
                    getStatusStyle(order.status),
                  )}
                >
                  {order.status}
                </span>
              </div>

              {/* Column 4: Total price */}
              <div className="col-span-12 md:col-span-2 flex items-center justify-between md:block md:text-right">
                <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-mute font-sans">
                  Total
                </span>
                <span className="text-xs font-bold text-ink dark:text-canvas font-sans">
                  {formatCurrency(order.total)}
                </span>
              </div>

              {/* Column 5: Actions button (View Detail link) */}
              <div className="col-span-12 md:col-span-2 flex justify-end">
                <Link
                  href={`/${countryCode}/account/orders/details/${order.id}`}
                  className="w-full md:w-auto"
                >
                  <Button
                    variant="outline"
                    className="w-full md:w-auto rounded-full border-hairline hover:bg-cloud/50 hover:text-ink dark:hover:bg-zinc-900 text-xs font-semibold px-5 py-1.5 h-8 cursor-pointer font-sans"
                  >
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
