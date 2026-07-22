"use client";

import { AuthInput } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { SocialLogin } from "@/feature/auth/social-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  Lock,
  Mail,
  Phone,
  SendHorizontal,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form Validation Schema using Zod
const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function RegisterPage({ params }: PageProps) {
  const { countryCode } = use(params);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Simulate register API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Registration form submitted:", data);
    setIsSubmitted(true);
    reset();

    // Mock redirect to login page after success
    setTimeout(() => {
      window.location.href = `/${countryCode}/login`;
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="py-16 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
        <div className="h-14 w-14 bg-[#6a35f2]/10 dark:bg-[#6a35f2]/20 text-[#6a35f2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#6a35f2]/20 dark:border-[#6a35f2]/40 shadow-inner">
          <CheckCircle className="h-7 w-7" />
        </div>
        <h2 className="font-display text-3xl uppercase tracking-tight text-foreground">
          Success!
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your account has been created successfully.
          <br />
          Redirecting to login page...
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Create account
          </h1>
        </div>
        {/* Input Fields */}
        <div className="space-y-3.5 pt-2">
          {/* Name Fields (Side-by-side) */}
          <div className="grid grid-cols-2 gap-3">
            {/* First Name */}
            <AuthInput
              type="text"
              placeholder="First name"
              icon={<User className="h-3.5 w-3.5" />}
              error={errors.first_name}
              disabled={isSubmitting}
              {...register("first_name")}
            />
            {/* Last Name */}
            <AuthInput
              type="text"
              placeholder="Last name"
              icon={<User className="h-3.5 w-3.5" />}
              error={errors.last_name}
              disabled={isSubmitting}
              {...register("last_name")}
            />
          </div>
          {/* Email field */}
          <AuthInput
            type="email"
            placeholder="Email"
            icon={<Mail className="h-3.5 w-3.5" />}
            error={errors.email}
            disabled={isSubmitting}
            {...register("email")}
          />
          {/* Phone field */}
          <AuthInput
            type="text"
            placeholder="Phone number"
            icon={<Phone className="h-3.5 w-3.5" />}
            error={errors.phone}
            disabled={isSubmitting}
            {...register("phone")}
          />
          {/* Password field */}
          <AuthInput
            type="password"
            placeholder="Password"
            icon={<Lock className="h-3.5 w-3.5" />}
            error={errors.password}
            disabled={isSubmitting}
            {...register("password")}
          />
        </div>
        {/* Submit Button */}
        <div className="pt-1">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-full bg-[#6a35f2] hover:bg-[#5829d6] text-white font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#6a35f2] border-none shadow-md shadow-purple-900/10"
          >
            {isSubmitting ? (
              "Creating Account..."
            ) : (
              <>
                Register
                <SendHorizontal className="h-3 w-3 fill-white text-white" />
              </>
            )}
          </Button>
        </div>
        {/* Sign In Link */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Already have an account?{" "}
          <Link
            href={`/${countryCode}/login`}
            className="text-foreground font-semibold underline hover:no-underline transition-all"
          >
            Sign In
          </Link>
        </p>
      </form>

      <SocialLogin />
    </div>
  );
}
