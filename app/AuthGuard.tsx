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
    // 1. Get token from sessionStorage
    const token = sessionStorage.getItem("token");
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // 2. Unauthenticated user accessing a protected page (e.g., /roles, /dashboard)
    if (!token && !isPublicRoute) {
      setIsAuthorized(false);
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // 3. Authenticated user accessing auth pages (e.g., /login)
    if (token && isPublicRoute) {
      setIsAuthorized(false);
      router.replace("/dashboard");
      return;
    }

    // Access granted
    setIsAuthorized(true);
  }, [pathname, router]);

  // Show a loading screen/blank screen while checking sessionStorage to prevent layout flickering
  if (!isAuthorized) {
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    // Render public route contents without flash if allowed
    if (isPublicRoute && !sessionStorage.getItem("token")) {
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