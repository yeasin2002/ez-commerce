"use client";

import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Left Column: Centered Form Container */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="w-full max-w-[320px] space-y-6">
          {children}
        </div>
      </div>

      {/* Right Column: Illustration Section */}
      <div className="hidden md:flex md:w-1/2 p-6 bg-background">
        <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-border">
          <Image
            src="/login-illustration.png"
            alt="Welcome Illustration"
            fill
            className="object-cover pointer-events-none"
            priority
          />
        </div>
      </div>
    </div>
  );
}