"use client";

import React, { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { SendHorizontal, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  verifyRegistrationOtp,
  resendRegistrationOtp,
} from "@/lib/data/auth-verification";

// Form Validation Schema using Zod
const otpSchema = z.object({
  otp: z.string().length(6, "Verification code must be exactly 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function OtpPage({ params }: PageProps) {
  const { countryCode } = use(params);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OtpFormData) => {
    setApiError(null);
    setResendStatus(null);

    if (!email) {
      setApiError(
        "Email address missing from verification request. Please register again."
      );
      return;
    }

    try {
      const res = await verifyRegistrationOtp(email, data.otp);
      if (!res.success) {
        setApiError(res.error || "Verification failed");
      } else {
        setIsSubmitted(true);
        reset();
        setTimeout(() => {
          window.location.href = `/${countryCode}/account`;
        }, 1500);
      }
    } catch (e) {
      setApiError(
        e instanceof Error ? e.message : "An unexpected error occurred"
      );
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending || !email) return;

    setIsResending(true);
    setApiError(null);
    setResendStatus(null);

    try {
      const res = await resendRegistrationOtp(email);
      if (!res.success) {
        setApiError(res.error || "Failed to resend code");
      } else {
        setResendStatus(res.message || "A new code has been sent!");
        setResendCooldown(60); // 60s cooldown
      }
    } catch (e) {
      setApiError(
        e instanceof Error ? e.message : "Failed to resend verification code"
      );
    } finally {
      setIsResending(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-16 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
        <div className="h-14 w-14 bg-[#6a35f2]/10 dark:bg-[#6a35f2]/20 text-[#6a35f2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#6a35f2]/20 dark:border-[#6a35f2]/40 shadow-inner">
          <CheckCircle className="h-7 w-7" />
        </div>
        <h2 className="font-display text-3xl uppercase tracking-tight text-foreground">
          Verified!
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your email address has been verified and your account is ready.
          <br />
          Redirecting to your account dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Verify email
        </h1>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Please enter the 6-digit verification code sent to{" "}
          <span className="font-semibold text-foreground">
            {email || "your email"}
          </span>
          .
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-3.5 pt-2">
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <div className="flex flex-col items-center gap-2">
              <div className="flex justify-center w-full">
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="size-10 text-sm md:text-base border-border"
                    />
                    <InputOTPSlot
                      index={1}
                      className="size-10 text-sm md:text-base border-border"
                    />
                    <InputOTPSlot
                      index={2}
                      className="size-10 text-sm md:text-base border-border"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-muted-foreground/40 mx-1" />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="size-10 text-sm md:text-base border-border"
                    />
                    <InputOTPSlot
                      index={4}
                      className="size-10 text-sm md:text-base border-border"
                    />
                    <InputOTPSlot
                      index={5}
                      className="size-10 text-sm md:text-base border-border"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {errors.otp && (
                <span className="text-[10px] font-semibold text-sale flex items-center gap-1 pl-2 mt-1 animate-in fade-in duration-200">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errors.otp.message}
                </span>
              )}
            </div>
          )}
        />

        {resendStatus && (
          <div className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-center font-medium animate-in fade-in duration-300">
            {resendStatus}
          </div>
        )}

        {apiError && (
          <div className="text-[10px] text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full text-center font-medium animate-in fade-in duration-300 font-sans">
            {apiError}
          </div>
        )}

        {/* Resend Code Link */}
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || isResending}
            className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors cursor-pointer"
          >
            {resendCooldown > 0
              ? `Resend Code in ${resendCooldown}s`
              : isResending
              ? "Sending code..."
              : "Resend Code?"}
          </button>
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
            "Verifying..."
          ) : (
            <>
              Verify Code
              <SendHorizontal className="h-3 w-3 fill-white text-white" />
            </>
          )}
        </Button>
      </div>

      {/* Sign In Link */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Need to sign in as a different user?{" "}
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
