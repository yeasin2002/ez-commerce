"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  RefreshCw,
  Lock,
  Truck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommonInput } from "@/components/shared";

// Form Validation Schema using Zod for Shipping Address
const shippingSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s-]{8,20}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  address1: z
    .string()
    .min(1, "Address Line 1 is required")
    .min(5, "Address must be more descriptive"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State / Division is required"),
  postalCode: z
    .string()
    .min(1, "Postcode is required")
    .min(4, "Postcode must be at least 4 characters"),
  country: z.string().min(1, "Country is required"),
  saveDefault: z.boolean().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

// Custom premium SVG Shirt Icon for Jersey previews
const JerseyIcon = ({
  color,
  collarColor = "#ffffff",
  accentColor = "transparent",
}: {
  color: string;
  collarColor?: string;
  accentColor?: string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className="w-12 h-12 select-none pointer-events-none drop-shadow-sm"
  >
    <path
      d="M 30 20 L 40 10 Q 50 15 60 10 L 70 20 L 88 28 L 82 46 L 72 42 L 72 90 L 28 90 L 28 42 L 18 46 L 12 28 Z"
      fill={color}
    />
    <path
      d="M 40 10 Q 50 15 60 10 L 58 16 Q 50 20 42 16 Z"
      fill={collarColor}
    />
    {accentColor !== "transparent" && (
      <rect
        x="47"
        y="22"
        width="6"
        height="68"
        fill={accentColor}
        opacity="0.35"
      />
    )}
  </svg>
);

// Custom premium SVG Shorts Icon for apparel preview
const ShortsIcon = ({ color }: { color: string }) => (
  <svg
    viewBox="0 0 100 100"
    className="w-12 h-12 select-none pointer-events-none drop-shadow-sm"
  >
    <rect x="25" y="20" width="50" height="8" rx="2" fill="#222" />
    <path
      d="M 25 28 L 75 28 L 80 75 L 53 75 L 50 55 L 47 75 L 20 75 Z"
      fill={color}
    />
    <path d="M 49 55 L 51 55 L 50 75 Z" fill="#111" opacity="0.4" />
  </svg>
);

export default function CheckoutPage() {
  // Accordion open/close state for checkout steps (1 to 4)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    {},
  );

  // Setup react-hook-form with Zod validation resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "Rifat Ahmed",
      phone: "+880 1712 345 678",
      email: "rifat.ahmed@example.com",
      address1: "House 12, Road 5, Dhanmondi",
      address2: "",
      city: "Dhaka",
      state: "Dhaka",
      postalCode: "1205",
      country: "BD",
      saveDefault: true,
    },
  });

  const onSubmit = (data: ShippingFormData) => {
    console.log("Shipping address submitted successfully:", data);
    setCompletedSteps((prev) => ({ ...prev, 1: true }));
    setActiveStep(2); // Automatically advance to the next step
  };

  // Mockup summary items
  const orderItems = [
    {
      id: "item-1",
      name: "Manchester United Home Jersey",
      size: "M",
      color: "Red",
      qty: 1,
      price: 2450,
      icon: (
        <JerseyIcon
          color="#c21d24"
          collarColor="#ffffff"
          accentColor="#ffffff"
        />
      ),
    },
    {
      id: "item-2",
      name: "Inter Miami Away Jersey",
      size: "L",
      color: "Pink",
      qty: 1,
      price: 2150,
      icon: (
        <JerseyIcon
          color="#fca5a5"
          collarColor="#000000"
          accentColor="#000000"
        />
      ),
    },
    {
      id: "item-3",
      name: "Nike Dri-FIT Short",
      size: "M",
      color: "Black",
      qty: 1,
      price: 950,
      icon: <ShortsIcon color="#18181b" />,
    },
  ];

  const subtotal = 5550;
  const shipping = 80;
  const discount = 300;
  const total = subtotal + shipping - discount;
  const freeShippingThreshold = 6000;
  const remainingForFreeShipping = freeShippingThreshold - total;
  const progressPercent = Math.min((total / freeShippingThreshold) * 100, 100);

  const formatCurrency = (val: number) => {
    return `৳ ${val.toLocaleString()}`;
  };

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Checkout Form Steps & Trust Badges */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Page Title Header */}
          <div className="pb-3 border-b border-hairline-soft">
            <h1 className="text-4xl sm:text-5xl font-display font-normal uppercase tracking-wider text-ink">
              Checkout
            </h1>
            <p className="text-xs text-mute mt-1 font-sans">
              Complete your order in a few simple steps.
            </p>
          </div>

          {/* STEP 1: Shipping Address */}
          <div className="bg-canvas border border-hairline-soft rounded-xl overflow-hidden transition-all duration-300">
            {/* Step Accordion Header */}
            <div
              className="p-5 flex items-center justify-between cursor-pointer select-none bg-canvas hover:bg-cloud/5 transition-colors"
              onClick={() => setActiveStep(activeStep === 1 ? 0 : 1)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-sans transition-colors ${
                    activeStep === 1
                      ? "bg-ink text-canvas"
                      : completedSteps[1]
                        ? "bg-[#0f766e] text-canvas"
                        : "bg-ink/10 text-ink/60 dark:bg-ink/20 dark:text-ink/80"
                  }`}
                >
                  {completedSteps[1] && activeStep !== 1 ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : (
                    "1"
                  )}
                </div>
                <span
                  className={`text-base font-display font-normal uppercase tracking-wider ${
                    activeStep === 1 ? "text-ink" : "text-ink/60"
                  }`}
                >
                  Shipping Address
                </span>
              </div>
              {activeStep === 1 ? (
                <ChevronUp className="h-4 w-4 text-mute" />
              ) : (
                <ChevronDown className="h-4 w-4 text-mute" />
              )}
            </div>

            {/* Step Content */}
            {activeStep === 1 && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="px-5 pb-6 pt-2 border-t border-hairline-soft/60 space-y-4 animate-in fade-in duration-300"
              >
                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CommonInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    error={errors.fullName}
                    {...register("fullName")}
                  />
                  <CommonInput
                    label="Phone Number"
                    placeholder="Enter phone number"
                    error={errors.phone}
                    {...register("phone")}
                  />
                </div>

                {/* Email Address */}
                <CommonInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  error={errors.email}
                  {...register("email")}
                />

                {/* Address Lines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CommonInput
                    label="Address Line 1"
                    placeholder="House, road, area"
                    error={errors.address1}
                    {...register("address1")}
                  />
                  <CommonInput
                    label="Address Line 2 (Optional)"
                    placeholder="Apartment, suite, unit, etc."
                    error={errors.address2}
                    {...register("address2")}
                  />
                </div>

                {/* City, State/Division, Postcode */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <CommonInput
                      label="City"
                      placeholder="City"
                      error={errors.city}
                      {...register("city")}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <CommonInput
                      label="State / Division"
                      placeholder="State / Division"
                      error={errors.state}
                      {...register("state")}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <CommonInput
                      label="Postcode"
                      placeholder="Zip code"
                      error={errors.postalCode}
                      {...register("postalCode")}
                    />
                  </div>
                </div>

                {/* Country / Region Selector */}
                <div className="space-y-1.5 w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-mute">
                    Country / Region
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-11 rounded-full border border-border bg-cloud/10 pl-5 pr-10 text-xs text-foreground focus:outline-none focus:border-ink transition-colors appearance-none cursor-pointer font-sans"
                      {...register("country")}
                    >
                      <option value="BD">Bangladesh</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mute pointer-events-none" />
                  </div>
                  {errors.country && (
                    <span className="text-[10px] font-semibold text-sale block mt-1">
                      {errors.country.message}
                    </span>
                  )}
                </div>

                {/* Save Address & Continue Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3">
                  <label className="flex items-center group cursor-pointer select-none">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer h-4.5 w-4.5 appearance-none rounded border border-border bg-canvas checked:bg-ink checked:border-ink focus:outline-none transition-all cursor-pointer"
                        {...register("saveDefault")}
                      />
                      <Check className="absolute h-3 w-3 text-canvas scale-0 peer-checked:scale-100 transition-transform pointer-events-none stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-ink ml-2.5 font-sans">
                      Save as default address
                    </span>
                  </label>

                  <Button
                    type="submit"
                    className="rounded-full bg-ink hover:bg-charcoal text-canvas px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer self-end sm:self-auto border-none h-11 shadow-sm font-sans"
                  >
                    Continue to delivery
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* STEP 2: Delivery Method (Collapsed) */}
          <div className="bg-canvas border border-hairline-soft rounded-xl overflow-hidden transition-all duration-300">
            <div
              className="p-5 flex items-center justify-between cursor-pointer select-none bg-canvas hover:bg-cloud/5 transition-colors"
              onClick={() => setActiveStep(activeStep === 2 ? 0 : 2)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-sans transition-colors ${
                    activeStep === 2
                      ? "bg-ink text-canvas"
                      : completedSteps[2]
                        ? "bg-[#0f766e] text-canvas"
                        : "bg-ink/10 text-ink/60 dark:bg-ink/20 dark:text-ink/80"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-base font-display font-normal uppercase tracking-wider ${
                    activeStep === 2 ? "text-ink" : "text-ink/60"
                  }`}
                >
                  Delivery Method
                </span>
              </div>
              {activeStep === 2 ? (
                <ChevronUp className="h-4 w-4 text-mute" />
              ) : (
                <ChevronDown className="h-4 w-4 text-mute" />
              )}
            </div>
            {activeStep === 2 && (
              <div className="px-5 pb-6 pt-4 border-t border-hairline-soft/60 animate-in fade-in duration-300">
                <p className="text-xs text-mute font-sans">
                  Delivery options will appear here.
                </p>
              </div>
            )}
          </div>

          {/* STEP 3: Payment Method (Collapsed) */}
          <div className="bg-canvas border border-hairline-soft rounded-xl overflow-hidden transition-all duration-300">
            <div
              className="p-5 flex items-center justify-between cursor-pointer select-none bg-canvas hover:bg-cloud/5 transition-colors"
              onClick={() => setActiveStep(activeStep === 3 ? 0 : 3)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-sans transition-colors ${
                    activeStep === 3
                      ? "bg-ink text-canvas"
                      : completedSteps[3]
                        ? "bg-[#0f766e] text-canvas"
                        : "bg-ink/10 text-ink/60 dark:bg-ink/20 dark:text-ink/80"
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-base font-display font-normal uppercase tracking-wider ${
                    activeStep === 3 ? "text-ink" : "text-ink/60"
                  }`}
                >
                  Payment Method
                </span>
              </div>
              {activeStep === 3 ? (
                <ChevronUp className="h-4 w-4 text-mute" />
              ) : (
                <ChevronDown className="h-4 w-4 text-mute" />
              )}
            </div>
            {activeStep === 3 && (
              <div className="px-5 pb-6 pt-4 border-t border-hairline-soft/60 animate-in fade-in duration-300">
                <p className="text-xs text-mute font-sans">
                  Payment integrations will appear here.
                </p>
              </div>
            )}
          </div>

          {/* STEP 4: Review & Place Order (Collapsed) */}
          <div className="bg-canvas border border-hairline-soft rounded-xl overflow-hidden transition-all duration-300">
            <div
              className="p-5 flex items-center justify-between cursor-pointer select-none bg-canvas hover:bg-cloud/5 transition-colors"
              onClick={() => setActiveStep(activeStep === 4 ? 0 : 4)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-sans transition-colors ${
                    activeStep === 4
                      ? "bg-ink text-canvas"
                      : completedSteps[4]
                        ? "bg-[#0f766e] text-canvas"
                        : "bg-ink/10 text-ink/60 dark:bg-ink/20 dark:text-ink/80"
                  }`}
                >
                  4
                </div>
                <span
                  className={`text-base font-display font-normal uppercase tracking-wider ${
                    activeStep === 4 ? "text-ink" : "text-ink/60"
                  }`}
                >
                  Review & Place Order
                </span>
              </div>
              {activeStep === 4 ? (
                <ChevronUp className="h-4 w-4 text-mute" />
              ) : (
                <ChevronDown className="h-4 w-4 text-mute" />
              )}
            </div>
            {activeStep === 4 && (
              <div className="px-5 pb-6 pt-4 border-t border-hairline-soft/60 animate-in fade-in duration-300">
                <p className="text-xs text-mute font-sans">
                  Review your items and place order.
                </p>
              </div>
            )}
          </div>

          {/* Trust Badges Bar */}
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
                <Lock className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink uppercase tracking-wide font-sans">
                  100% Secure
                </h4>
                <p className="text-[10px] text-mute mt-0.5 font-sans leading-relaxed">
                  Powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary Sticky Panel */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-canvas border border-hairline-soft rounded-xl p-6 shadow-sm">
            {/* Summary Title & Count */}
            <div className="flex items-baseline justify-between border-b border-hairline-soft pb-4">
              <h2 className="text-2xl font-display font-normal uppercase tracking-wider text-ink">
                Order Summary
              </h2>
              <span className="text-xs text-mute font-semibold font-sans">
                3 Items
              </span>
            </div>

            {/* Line Items List */}
            <div className="divide-y divide-hairline-soft/50 max-h-[350px] overflow-y-auto pr-1">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4 first:pt-3 last:pb-3"
                >
                  <div className="w-14 h-14 bg-cloud/50 border border-hairline-soft rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-ink truncate font-sans">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-mute mt-1 font-sans">
                      Size: {item.size} &nbsp;•&nbsp; Color: {item.color}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-mute font-medium block">
                      x {item.qty}
                    </span>
                    <span className="text-xs font-bold text-ink mt-1 block font-sans">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Summary Breakdown */}
            <div className="border-t border-hairline-soft pt-4 pb-2 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-ink/80 font-sans">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink/80 font-sans">
                <span>Shipping</span>
                <span className="font-semibold text-ink">
                  {formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-[#0f766e] dark:text-emerald-400">
                  Discount
                </span>
                <span className="font-bold text-[#0f766e] dark:text-emerald-400">
                  -{formatCurrency(discount)}
                </span>
              </div>
            </div>

            {/* Absolute Grand Total */}
            <div className="border-t border-hairline-soft pt-4 flex items-baseline justify-between">
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
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Free Shipping Progress Indicator Block */}
            <div className="bg-cloud/20 border border-hairline-soft/80 rounded-xl p-4 mt-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0f766e]/10 text-[#0f766e] flex items-center justify-center shrink-0">
                  <Truck className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-ink font-sans">
                    Free shipping on orders over{" "}
                    {formatCurrency(freeShippingThreshold)}
                  </h4>
                  <p className="text-[10px] text-mute mt-0.5 font-sans leading-relaxed">
                    Add {formatCurrency(remainingForFreeShipping)} more to get
                    free shipping!
                  </p>
                </div>
              </div>

              <div className="w-full h-1.5 bg-cloud rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-[#0f766e] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-end text-[9px] font-bold text-mute mt-1.5 font-sans tracking-wide">
                {formatCurrency(total)} /{" "}
                {formatCurrency(freeShippingThreshold)}
              </div>
            </div>

            {/* Stripe Trust Badges */}
            <div className="border border-hairline-soft/80 bg-canvas rounded-xl p-3.5 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-mute font-semibold tracking-wide font-sans uppercase">
                <span>Secure payments by</span>
                <svg viewBox="0 0 60 25" className="h-3.5 fill-ink opacity-70">
                  <path d="M54.9 11.2c0-3.6-1.9-5.7-5.1-5.7-3.4 0-5.5 2.4-5.5 5.9 0 4.1 2.3 5.8 5.6 5.8 1.6 0 3-.4 3.9-1v-2.2c-.8.4-1.9.6-3 .6-1.8 0-3-.7-3.2-2.1h9.3c0-.4.1-1 .1-1.3zm-7.3-1.6c0-1.2.8-2 2.1-2 1.2 0 1.9.8 1.9 2h-4zm-8.8 6.5V9.4c0-2-.8-3.9-3.7-3.9-1.5 0-2.8.6-3.5 1.3V5.8h-3v12h3v-7.1c0-1.2 1-1.8 2.1-1.8.9 0 1.6.6 1.6 1.8v7.1h3.5zm-14.7 0V5.8h-3v1.6c-.6-.8-1.7-1.5-3.2-1.5-2.8 0-5.1 2.4-5.1 5.9 0 3.7 2.2 5.9 5.1 5.9 1.5 0 2.6-.7 3.2-1.5v1.4h3zm-3-5.9c0-1.9-1.2-3.1-2.7-3.1-1.6 0-2.8 1.2-2.8 3.1s1.2 3.1 2.8 3.1c1.5-.1 2.7-1.3 2.7-3.1zM17.5.3V4c-.8-.4-1.8-.6-2.7-.6-2.2 0-3.6 1.4-3.6 3.8v2H9.4v2.7h1.8V18h3v-6.2h2.5V9.1h-2.5V7.4c0-.9.5-1.4 1.4-1.4.5 0 1 .1 1.3.3V.3h-1.4zm-14 8c0-.9.8-1.3 2.1-1.3 1.2 0 2.4.3 3.3.8V5.5c-1-.4-2.1-.6-3.4-.6-2.9 0-5 1.5-5 4.1 0 3.8 5.2 3.2 5.2 4.9 0 .9-.9 1.3-2.3 1.3-1.5 0-2.7-.4-3.7-1v2.3c1 .5 2.4.7 3.8.7 3 0 5.2-1.4 5.2-4.1.1-3.9-5.2-3.3-5.2-4.9z" />
                </svg>
              </div>

              <div className="flex gap-1">
                <div className="w-8 h-5 rounded border border-hairline bg-canvas flex items-center justify-center text-[7px] font-bold text-blue-800 tracking-wider font-sans select-none italic">
                  VISA
                </div>
                <div className="w-8 h-5 rounded border border-hairline bg-canvas flex items-center justify-center gap-0.5 select-none shrink-0 overflow-hidden">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#eb001b] -mr-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f00] opacity-90" />
                </div>
                <div className="w-8 h-5 rounded border border-hairline bg-[#017cc2] flex items-center justify-center text-[6px] font-extrabold text-canvas tracking-wider font-sans select-none">
                  AMEX
                </div>
                <div className="w-8 h-5 rounded border border-hairline bg-canvas flex items-center justify-center text-[7px] font-semibold text-blue-900 tracking-tighter font-sans select-none">
                  Diners
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
