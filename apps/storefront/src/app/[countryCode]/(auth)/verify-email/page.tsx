"use client";

import { use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PageProps {
  params: Promise<{
    countryCode: string;
  }>;
}

export default function VerifyEmailPage({ params }: PageProps) {
  const { countryCode } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    router.replace(`/${countryCode}/otp${query ? `?${query}` : ""}`);
  }, [countryCode, router, searchParams]);

  return (
    <div className="py-16 text-center space-y-4 font-sans">
      <p className="text-xs text-muted-foreground animate-pulse">
        Redirecting to verification...
      </p>
    </div>
  );
}
