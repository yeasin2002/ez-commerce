"use client";

import React, { use, useState } from "react";
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
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    // Simulate OTP verification API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("OTP verification code submitted:", data);
    setIsSubmitted(true);
    reset();

    // Mock redirect to home page after success
    setTimeout(() => {
      window.location.href = `/${countryCode}`;
    }, 2000);
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
          Your security code has been verified.
          <br />
          Redirecting to home page...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Security code
        </h1>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Please enter the 6-digit verification code sent to your device.
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

        {/* Resend Code Link */}
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={() => console.log("Resend OTP clicked")}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Resend Code?
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
