"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  Receipt, 
  ShieldCheck, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldUser
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }, // or "/"
  { label: "Merchants", href: "/merchants", icon: Store },
  { label: "Receipts", href: "/receipts", icon: Receipt },
  { label: "Roles", href: "/roles", icon: ShieldCheck },
  { label: "Users", href: "/users", icon: Users },

];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear session cookie and redirect to login
    document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <ShieldUser className="h-5 w-5" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-foreground leading-tight truncate">
                Netsa Tech
              </span>
              <span className="text-xs text-muted-foreground font-medium leading-tight">
                Admin Portal
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          // Exact match for dashboard root, startsWith for child routes
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0 text-destructive" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}