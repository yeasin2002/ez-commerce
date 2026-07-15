"use client";

import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Mail, SendHorizontal, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Form Validation Schema using Zod
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function ForgotPasswordPage({ params }: PageProps) {
  const { countryCode } = use(params);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simulate reset password API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Forgot password form submitted:", data);
    setIsSubmitted(true);
    reset();
  };

  if (isSubmitted) {
    return (
      <div className="py-16 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
        <div className="h-14 w-14 bg-[#6a35f2]/10 dark:bg-[#6a35f2]/20 text-[#6a35f2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#6a35f2]/20 dark:border-[#6a35f2]/40 shadow-inner">
          <CheckCircle className="h-7 w-7" />
        </div>
        <h2 className="font-display text-3xl uppercase tracking-tight text-foreground">
          Email Sent!
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We have sent a password reset link to your email.
          <br />
          Please check your inbox.
        </p>
        <div className="pt-2">
          <Link
            href={`/${countryCode}/login`}
            className="text-xs text-foreground font-semibold underline hover:no-underline transition-all"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Reset password
        </h1>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-3.5 pt-2">
        {/* Email field */}
        <div className="space-y-1">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none">
              <Mail className="h-3.5 w-3.5" />
            </span>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              disabled={isSubmitting}
              className={cn(
                "w-full h-10 rounded-full border border-border bg-muted/20 dark:bg-[#121212]/60 pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-muted-foreground/60 focus:ring-1 focus:ring-muted-foreground/60 transition-all font-sans",
                errors.email ? "border-sale bg-sale/5 focus:border-sale" : ""
              )}
            />
          </div>
          {errors.email && (
            <span className="text-[10px] font-semibold text-sale flex items-center gap-1 pl-4 mt-0.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.email.message}
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 rounded-full bg-[#6a35f2] hover:bg-[#5829d6] text-white font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#6a35f2] border-none shadow-md shadow-purple-900/10"
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              Send Reset Link
              <SendHorizontal className="h-3 w-3 fill-white text-white" />
            </>
          )}
        </Button>
      </div>

      {/* Sign In Link */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Remember your password?{" "}
        <Link
          href={`/${countryCode}/login`}
          className="text-foreground font-semibold underline hover:no-underline transition-all"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
