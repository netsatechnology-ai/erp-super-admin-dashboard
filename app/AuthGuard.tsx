"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// Define public authentication routes
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // 1. Unauthenticated user accessing a protected page (e.g., /roles, /dashboard)
    if (!token && !isPublicRoute) {
      setIsAuthorized(false);
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Authenticated user accessing auth pages (e.g., /login)
    if (token && isPublicRoute) {
      setIsAuthorized(false);
      router.replace("/dashboard");
      return;
    }

    // Access granted
    setIsAuthorized(true);
  }, [pathname, router]);

  if (!isAuthorized) {
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // Guard window check for SSR pre-rendering during build
    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

    if (isPublicRoute && !token) {
      return <>{children}</>;
    }

    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}