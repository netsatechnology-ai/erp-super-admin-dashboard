"use client";

import { usePathname } from "next/navigation";
import { 
  Bell, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  ShieldCheck, 
  Boxes,
  Home
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Map active route paths to their corresponding custom labels & icons
const ROUTE_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  "/dashboard": { label: "Dashboard Overview", icon: LayoutDashboard },
  "/dashboard/users": { label: "User Management", icon: Users },
  "/dashboard/roles": { label: "Roles & Permissions", icon: ShieldCheck },
  "/dashboard/inventory": { label: "Inventory & Products", icon: Boxes },
  "/dashboard/reports": { label: "System Reports", icon: FileText },
  "/dashboard/settings": { label: "Portal Settings", icon: Settings },
};

export function Header() {
  const pathname = usePathname();

  // Matched route metadata or dynamic default
  const currentRoute = ROUTE_CONFIG[pathname];
  const IconComponent = currentRoute?.icon || ShieldCheck;

  // Format breadcrumb segments
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-6 backdrop-blur-md transition-all">
      {/* Left Section: Icon Badge & Inline Breadcrumb Header */}
      <div className="flex items-center gap-3.5">
        {/* Dynamic Route Icon Container */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs transition-transform duration-200 hover:scale-105">
          <IconComponent className="h-5 w-5" />
        </div>

        {/* Clean Breadcrumb & Title Flow */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const formattedSegment = segment.replace(/-/g, " ");

            return (
              <div key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                )}
                <span
                  className={
                    isLast
                      ? "text-base font-semibold tracking-tight text-foreground capitalize"
                      : "text-sm font-medium text-muted-foreground hover:text-foreground capitalize transition-colors"
                  }
                >
                  {isLast && currentRoute ? currentRoute.label : formattedSegment}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-all hover:bg-accent hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring/40"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>

        <div className="h-5 w-px bg-border/80 mx-1" />

        {/* User Profile Meta Card */}
        <div className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-accent/50 cursor-pointer">
          <Avatar className="h-9 w-9 border border-border shadow-2xs">
            <AvatarImage src="/avatars/admin.png" alt="Abebe Bikila" />
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
              AB
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground leading-none">
                Abebe Bikila
              </span>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Super Admin
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground leading-none mt-1">
              admin@netsatech.com
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}