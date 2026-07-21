import React from "react";
import { IconBrandFacebook, IconBrandGoogle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const SocialLogin = () => {
  return (
    <div className="w-full max-w-[320px] mt-6 space-y-6">
      {/* Top Horizontal Bar / Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground font-medium tracking-wider">
            OR
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-border hover:bg-muted font-medium flex items-center justify-center gap-2 h-10"
        >
          <IconBrandGoogle className="size-5" />
          <span>Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-border hover:bg-muted font-medium flex items-center justify-center gap-2 h-10"
        >
          <IconBrandFacebook className="size-5" />
          <span>Facebook</span>
        </Button>
      </div>
    </div>
  );
};
