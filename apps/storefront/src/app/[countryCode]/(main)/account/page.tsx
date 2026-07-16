"use client";

import React, { use } from "react";
import Link from "next/link";
import { 
  IconShoppingBag, 
  IconMapPin, 
  IconUser, 
  IconChevronRight, 
  IconArrowRight 
} from "@tabler/icons-react";
import { mockCustomerProfile, mockOrders } from "@/data/account.data";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function AccountOverviewPage({ params }: PageProps) {
  const { countryCode } = use(params);

  // Take the first 3 recent orders for dashboard summary
  const recentOrders = mockOrders.slice(0, 3);

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
      
      {/* Welcome Banner */}
      <div className="pb-4 border-b border-hairline-soft">
        <h1 className="text-4xl font-display uppercase tracking-wider text-ink dark:text-canvas">
          Welcome back, {mockCustomerProfile.fullName.split(" ")[0]}!
        </h1>
        <p className="text-xs text-mute mt-1 font-sans">
          Here&apos;s what is happening with your account today.
        </p>
      </div>

      {/* Stats Cards Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Total Orders */}
        <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-cloud/50 dark:bg-zinc-900 flex items-center justify-center text-ink/70 dark:text-canvas/70 shrink-0">
            <IconShoppingBag size={20} />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-mute block leading-none">
              Total Orders
            </span>
            <span className="text-2xl font-bold text-ink dark:text-canvas block">
              12
            </span>
            <Link 
              href={`/${countryCode}/account/orders`}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/80 dark:text-canvas/80 hover:text-ink dark:hover:text-canvas uppercase tracking-wider transition-colors font-sans mt-1.5"
            >
              <span>View all orders</span>
              <IconArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* Card 2: Saved Addresses */}
        <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-cloud/50 dark:bg-zinc-900 flex items-center justify-center text-ink/70 dark:text-canvas/70 shrink-0">
            <IconMapPin size={20} />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-mute block leading-none">
              Saved Addresses
            </span>
            <span className="text-2xl font-bold text-ink dark:text-canvas block">
              3
            </span>
            <Link 
              href={`/${countryCode}/account/addresses`}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/80 dark:text-canvas/80 hover:text-ink dark:hover:text-canvas uppercase tracking-wider transition-colors font-sans mt-1.5"
            >
              <span>Manage addresses</span>
              <IconArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* Card 3: Profile Info */}
        <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-cloud/50 dark:bg-zinc-900 flex items-center justify-center text-ink/70 dark:text-canvas/70 shrink-0">
            <IconUser size={20} />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-mute block leading-none">
              Profile
            </span>
            <span className="text-base font-bold text-ink dark:text-canvas block truncate">
              {mockCustomerProfile.fullName}
            </span>
            <Link 
              href={`/${countryCode}/account/profile`}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/80 dark:text-canvas/80 hover:text-ink dark:hover:text-canvas uppercase tracking-wider transition-colors font-sans mt-1.5"
            >
              <span>Edit profile</span>
              <IconArrowRight size={10} />
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Orders List Card Section */}
      <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-6 space-y-4">
        
        {/* Title bar */}
        <div className="flex items-center justify-between pb-3 border-b border-hairline-soft/80">
          <h2 className="text-base font-bold uppercase tracking-wider text-ink dark:text-canvas font-sans">
            Recent Orders
          </h2>
          <Link 
            href={`/${countryCode}/account/orders`}
            className="flex items-center gap-1.5 text-xs font-semibold text-mute hover:text-ink dark:hover:text-canvas transition-colors font-sans"
          >
            <span>View all orders</span>
            <IconArrowRight size={12} />
          </Link>
        </div>

        {/* Orders rows list */}
        <div className="divide-y divide-hairline-soft/50">
          {recentOrders.map((order) => (
            <Link 
              key={order.id}
              href={`/${countryCode}/account/orders/details/${order.id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4.5 first:pt-1 last:pb-1 group cursor-pointer hover:bg-cloud/10 dark:hover:bg-zinc-900/30 px-3 -mx-3 rounded-lg transition-colors"
            >
              {/* Product thumbnails & info */}
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5 shrink-0">
                  {/* Miniature representations of shirts */}
                  <div className="w-10 h-10 rounded border border-hairline bg-cloud/50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 100 100" className="w-7 h-7 fill-ink/65 dark:fill-canvas/75 select-none pointer-events-none">
                      <path d="M 30 20 L 40 10 Q 50 15 60 10 L 70 20 L 88 28 L 82 46 L 72 42 L 72 90 L 28 90 L 28 42 L 18 46 L 12 28 Z" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold text-ink dark:text-canvas font-sans group-hover:text-ink transition-colors">
                    Order #{order.id}
                  </h3>
                  <span className="text-[10px] text-mute font-sans mt-0.5 block">
                    {order.date}
                  </span>
                </div>
              </div>

              {/* Status badge, items count, final pricing sum */}
              <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0">
                <span className={cn(
                  "text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-sans",
                  getStatusStyle(order.status)
                )}>
                  {order.status}
                </span>
                
                <span className="text-xs text-mute font-semibold font-sans min-w-[70px] text-left sm:text-right">
                  {order.itemCount} {order.itemCount === 1 ? "Item" : "Items"}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink dark:text-canvas font-sans text-right">
                    {formatCurrency(order.total)}
                  </span>
                  <IconChevronRight size={14} className="text-mute group-hover:text-ink dark:group-hover:text-canvas transition-colors hidden sm:block" />
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>

    </div>
  );
}
