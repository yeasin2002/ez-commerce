"use client";

import * as React from "react";
import { FieldError } from "react-hook-form";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthInputProps extends React.ComponentPropsWithoutRef<"input"> {
  icon: React.ReactNode;
  error?: FieldError;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ icon, error, className, type = "text", placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const hasError = !!error;
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1 w-full font-sans">
        <div className="relative flex items-center">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none flex items-center">
            {icon}
          </span>
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            className={cn(
              "w-full h-10 rounded-full border border-border bg-muted/20 dark:bg-[#121212]/60 pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-muted-foreground/60 focus:ring-1 focus:ring-muted-foreground/60 transition-all font-sans",
              isPassword && "pr-10",
              hasError
                ? "border-sale bg-sale/5 focus:border-sale focus:ring-sale/30"
                : "",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-0.5 flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>

        {error && (
          <span className="text-[10px] font-semibold text-sale flex items-center gap-1 pl-4 mt-0.5 animate-in fade-in duration-200">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error.message}
          </span>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
