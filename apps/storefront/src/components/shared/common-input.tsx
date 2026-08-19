"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { FieldError } from "react-hook-form";

export interface CommonInputProps {
  label: string;
  error?: FieldError;
  textarea?: boolean;
  type?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const CommonInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  CommonInputProps
>(
  (
    { label, error, textarea, type = "text", placeholder, className, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const hasError = !!error;
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1.5 w-full">
        <label
          htmlFor={props.id || props.name}
          className="text-[11px] font-bold uppercase tracking-wider text-mute"
        >
          {label}
        </label>

        {textarea ? (
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            id={props.id || props.name}
            placeholder={placeholder}
            {...(props as React.ComponentPropsWithoutRef<"textarea">)}
            className={cn(
              "w-full rounded-2xl border px-5 py-4 text-xs focus:outline-none transition-colors min-h-40 resize-none border-hairline-soft bg-cloud/10 focus:border-ink",
              hasError
                ? "border-sale bg-sale/5 focus:border-sale focus-visible:border-sale focus-visible:ring-0"
                : "",
              className,
            )}
          />
        ) : (
          <div className="relative flex items-center">
            <Input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              id={props.id || props.name}
              type={inputType}
              placeholder={placeholder}
              {...(props as React.ComponentPropsWithoutRef<"input">)}
              className={cn(
                "w-full h-11 rounded-full border px-5 py-3 text-xs focus:outline-none transition-colors border-hairline-soft bg-cloud/10 focus:border-ink",
                isPassword ? "pr-11" : "",
                hasError
                  ? "border-sale bg-sale/5 focus:border-sale focus-visible:border-sale focus-visible:ring-0"
                  : "",
                className,
              )}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1 flex items-center justify-center cursor-pointer focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        )}

        {error && (
          <span className="text-[10px] font-semibold text-sale flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error.message}
          </span>
        )}
      </div>
    );
  },
);

CommonInput.displayName = "CommonInput";
