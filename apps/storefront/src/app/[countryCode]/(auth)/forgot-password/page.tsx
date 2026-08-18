"use client";

import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, SendHorizontal, CheckCircle, Key, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/shared";
import {
  requestPasswordReset,
  resetPasswordWithToken,
} from "@/lib/data/customer";

// Schema for requesting reset token
const requestResetSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// Schema for resetting password with token
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long"),
});

type RequestResetFormData = z.infer<typeof requestResetSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function ForgotPasswordPage({ params }: PageProps) {
  const { countryCode } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || "";

  const [viewMode, setViewMode] = useState<"request" | "reset">(
    urlToken ? "reset" : "request",
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Form for requesting reset
  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    formState: { errors: requestErrors, isSubmitting: isRequestSubmitting },
    reset: resetRequestForm,
  } = useForm<RequestResetFormData>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form for updating password with token
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
    reset: resetPasswordForm,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: urlToken,
      newPassword: "",
    },
  });

  const onRequestSubmit = async (data: RequestResetFormData) => {
    setApiError(null);
    try {
      const res = await requestPasswordReset(data.email);
      if (res.success) {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        resetRequestForm();
      } else {
        setApiError(res.error || "Failed to request password reset");
      }
    } catch (e) {
      setApiError(
        e instanceof Error ? e.message : "An unexpected error occurred",
      );
    }
  };

  const onResetSubmit = async (data: ResetPasswordFormData) => {
    setApiError(null);
    try {
      const res = await resetPasswordWithToken(data.token, data.newPassword);
      if (res.success) {
        setIsSubmitted(true);
        resetPasswordForm();
        setTimeout(() => {
          router.push(`/${countryCode}/login`);
        }, 2000);
      } else {
        setApiError(
          res.error || "Failed to update password. Invalid or expired token.",
        );
      }
    } catch (e) {
      setApiError(
        e instanceof Error ? e.message : "An unexpected error occurred",
      );
    }
  };

  if (isSubmitted) {
    if (viewMode === "reset") {
      return (
        <div className="py-16 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
          <div className="h-14 w-14 bg-[#6a35f2]/10 dark:bg-[#6a35f2]/20 text-[#6a35f2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#6a35f2]/20 dark:border-[#6a35f2]/40 shadow-inner">
            <CheckCircle className="h-7 w-7" />
          </div>
          <h2 className="font-display text-3xl uppercase tracking-tight text-foreground">
            Password Updated!
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your password has been successfully reset.
            <br />
            Redirecting to login page...
          </p>
        </div>
      );
    }

    return (
      <div className="py-16 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
        <div className="h-14 w-14 bg-[#6a35f2]/10 dark:bg-[#6a35f2]/20 text-[#6a35f2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#6a35f2]/20 dark:border-[#6a35f2]/40 shadow-inner">
          <CheckCircle className="h-7 w-7" />
        </div>
        <h2 className="font-display text-3xl uppercase tracking-tight text-foreground">
          Reset Token Generated!
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We&apos;ve initiated a password reset for{" "}
          <strong className="text-foreground">{submittedEmail}</strong>.
          <br />
          <span className="text-[11px] text-muted-foreground">
            (Check your email or backend terminal for your reset token)
          </span>
        </p>
        <div className="pt-4 flex flex-col gap-2">
          <Button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setViewMode("reset");
            }}
            className="w-full h-10 rounded-full bg-[#6a35f2] hover:bg-[#5829d6] text-white font-semibold text-xs uppercase tracking-wider"
          >
            Enter Reset Token
          </Button>
          <Link
            href={`/${countryCode}/login`}
            className="text-xs text-foreground font-semibold underline hover:no-underline transition-all mt-2"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-sans">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {viewMode === "request" ? "Reset password" : "Set new password"}
        </h1>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {viewMode === "request"
            ? "Enter your email address to receive a password reset token."
            : "Enter your reset token and new password."}
        </p>
      </div>

      {viewMode === "request" ? (
        <form
          onSubmit={handleRequestSubmit(onRequestSubmit)}
          className="space-y-4"
        >
          {/* Email field */}
          <AuthInput
            type="email"
            placeholder="Email address"
            icon={<Mail className="h-3.5 w-3.5" />}
            error={requestErrors.email}
            disabled={isRequestSubmitting}
            {...registerRequest("email")}
          />

          {apiError && (
            <div className="text-[11px] text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-full text-center font-medium animate-in fade-in duration-300">
              {apiError}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1">
            <Button
              type="submit"
              disabled={isRequestSubmitting}
              className="w-full h-10 rounded-full bg-[#6a35f2] hover:bg-[#5829d6] text-white font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#6a35f2] border-none shadow-md shadow-purple-900/10"
            >
              {isRequestSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Send Reset Link
                  <SendHorizontal className="h-3 w-3 fill-white text-white" />
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setViewMode("reset")}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline cursor-pointer"
            >
              Already have a token?
            </button>
            <Link
              href={`/${countryCode}/login`}
              className="text-foreground font-semibold underline hover:no-underline transition-all"
            >
              Sign In
            </Link>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleResetSubmit(onResetSubmit)}
          className="space-y-4"
        >
          {/* Token field */}
          <AuthInput
            type="text"
            placeholder="Reset token"
            icon={<Key className="h-3.5 w-3.5" />}
            error={resetErrors.token}
            disabled={isResetSubmitting}
            {...registerReset("token")}
          />

          {/* New Password field */}
          <AuthInput
            type="password"
            placeholder="New password (min 6 characters)"
            icon={<Lock className="h-3.5 w-3.5" />}
            error={resetErrors.newPassword}
            disabled={isResetSubmitting}
            {...registerReset("newPassword")}
          />

          {apiError && (
            <div className="text-[11px] text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-full text-center font-medium animate-in fade-in duration-300">
              {apiError}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1">
            <Button
              type="submit"
              disabled={isResetSubmitting}
              className="w-full h-10 rounded-full bg-[#6a35f2] hover:bg-[#5829d6] text-white font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#6a35f2] border-none shadow-md shadow-purple-900/10"
            >
              {isResetSubmitting ? (
                "Updating..."
              ) : (
                <>
                  Update Password
                  <SendHorizontal className="h-3 w-3 fill-white text-white" />
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setViewMode("request")}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline cursor-pointer"
            >
              Request new token
            </button>
            <Link
              href={`/${countryCode}/login`}
              className="text-foreground font-semibold underline hover:no-underline transition-all"
            >
              Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
