"use client";

import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Key, SendHorizontal, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/shared";

// Form Validation Schema using Zod
const verifySchema = z.object({
  code: z
    .string()
    .min(4, "Verification code must be at least 4 characters long"),
});

type VerifyFormData = z.infer<typeof verifySchema>;

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function VerifyPhonePage({ params }: PageProps) {
  const { countryCode } = use(params);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    // Simulate verification API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Phone verification code submitted:", data);
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
          Your phone number has been verified successfully.
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
          Verify phone number
        </h1>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Please enter the verification code we sent to your mobile phone.
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-3.5 pt-2">
        {/* Verification Code field */}
        <AuthInput
          type="text"
          placeholder="Verification code"
          icon={<Key className="h-3.5 w-3.5" />}
          error={errors.code}
          disabled={isSubmitting}
          {...register("code")}
        />

        {/* Resend Code Link */}
        <div className="flex justify-end mt-0.5">
          <button
            type="button"
            onClick={() => console.log("Resend code clicked")}
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
              Verify Phone
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
