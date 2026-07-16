"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  IconDashboard, 
  IconShoppingBag, 
  IconMapPin, 
  IconHeart, 
  IconUser, 
  IconShield, 
  IconBell, 
  IconLogout, 
  IconMenu2 
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  countryCode: string;
}

export function Sidebar({ countryCode }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Setup navigation menu items matching the image
  const menuItems = [
    {
      name: "Overview",
      href: `/${countryCode}/account`,
      icon: <IconDashboard size={18} className="shrink-0" />,
      exact: true,
    },
    {
      name: "Orders",
      href: `/${countryCode}/account/orders`,
      icon: <IconShoppingBag size={18} className="shrink-0" />,
      exact: false,
    },
    {
      name: "Addresses",
      href: `/${countryCode}/account/addresses`,
      icon: <IconMapPin size={18} className="shrink-0" />,
      exact: false,
    },
    {
      name: "Wishlist",
      href: `/${countryCode}/wishlist`,
      icon: <IconHeart size={18} className="shrink-0" />,
      exact: false,
      badge: 8,
    },
    {
      name: "Profile",
      href: `/${countryCode}/account/profile`,
      icon: <IconUser size={18} className="shrink-0" />,
      exact: false,
    },
    {
      name: "Security",
      href: `/${countryCode}/account/security`,
      icon: <IconShield size={18} className="shrink-0" />,
      exact: false,
    },
    {
      name: "Notifications",
      href: "#", // mock notifications
      icon: <IconBell size={18} className="shrink-0" />,
      exact: false,
      badge: 2,
    },
  ];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // In future this will trigger Medusa sign out workflow
    console.log("Mock logout triggered");
    router.push(`/${countryCode}/login`);
  };

  // Helper to check if item is currently active
  const isActive = (href: string, exact: boolean) => {
    if (href === "#") return false;
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Find active item name for mobile header preview
  const activeItem = menuItems.find(item => isActive(item.href, item.exact)) || menuItems[0];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-canvas text-ink font-sans">
      <div className="space-y-1.5 py-4">
        {menuItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between w-full h-11 px-4 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors",
                active 
                  ? "bg-ink text-canvas font-bold" 
                  : "text-ink/70 hover:bg-cloud/50 hover:text-ink"
              )}
            >
              <div className="flex items-center gap-3.5">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className={cn(
                  "flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] font-bold",
                  active ? "bg-canvas text-ink" : "bg-cloud text-ink/80"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Separator / Spacer */}
        <div className="h-px bg-hairline-soft/60 my-2" />

        {/* Logout Link */}
        <button
          onClick={(e) => {
            setIsOpen(false);
            handleLogout(e);
          }}
          className="flex items-center gap-3.5 w-full h-11 px-4 text-xs font-semibold uppercase tracking-wider text-sale hover:bg-sale/5 rounded-full transition-colors cursor-pointer text-left"
        >
          <IconLogout size={18} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR PANEL */}
      <div className="hidden lg:block bg-canvas border border-hairline-soft rounded-2xl p-5 sticky top-24 shadow-sm">
        <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-mute mb-4 px-4 font-sans">
          My Account
        </h2>
        {renderSidebarContent()}
      </div>

      {/* MOBILE COLLAPSIBLE RESPONSIVE BAR */}
      <div className="lg:hidden w-full bg-canvas border border-hairline-soft rounded-xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-mute shrink-0">
            {activeItem.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-mute font-sans block leading-none">
              Account Menu
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-ink font-sans mt-1 block">
              {activeItem.name}
            </span>
          </div>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10 border-hairline hover:bg-cloud/50 text-ink cursor-pointer"
            >
              <IconMenu2 size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-6 bg-canvas border-r border-hairline-soft">
            <SheetHeader className="text-left border-b border-hairline-soft pb-4 mb-2">
              <SheetTitle className="text-lg font-display uppercase tracking-wider text-ink">
                My Account
              </SheetTitle>
            </SheetHeader>
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
