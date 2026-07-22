import React from "react";
import { Header } from "@/feature/home/Header";
import { Footer } from "@/feature/home/Footer";
import { Sidebar } from "@/feature/account/sidebar";
import { retrieveCustomer } from "@/lib/data/customer";
import { redirect } from "next/navigation";

interface AccountLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    countryCode: string;
  }>;
}

export default async function AccountLayout({
  children,
  params,
}: AccountLayoutProps) {
  const { countryCode } = await params;

  const customer = await retrieveCustomer();
  if (!customer) {
    redirect(`/${countryCode}/login?expired=true`);
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* Shared Navigation Header */}
      <Header />

      {/* Main Account Dashboard Shell */}
      <main className="flex-1 container-page py-6 lg:py-12 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Collapsible Responsive Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar countryCode={countryCode} />
          </div>

          {/* Children Sub-pages Content Pane */}
          <div className="lg:col-span-9">{children}</div>
        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
