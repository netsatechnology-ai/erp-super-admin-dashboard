"use client";

import {
  ShieldCheck,
  Lock,
  Edit3,
  Users,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role } from "./RoleDetailModal";
import Pagination from "@/components/ui/Pagination";

// Extended Role type support for status
export interface status  {
  status?: "ACTIVE" | "INACTIVE" | "DEACTIVATED" | "DRAFT";
}

interface RolesGridProps {
  roles: Role[];
  onOpenDetail: (role: Role) => void;
  filter:any,
  setFilter:any,
}

export function RolesGrid({ roles, onOpenDetail,filter, setFilter }: RolesGridProps) {
  if (roles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-xs text-muted-foreground">
        No roles found matching your search or filter criteria.
      </div>
    );
  }

  // Helper function to render status badges
  const renderStatusBadge = (status?: string) => {
    const currentStatus = status || "ACTIVE";

    switch (currentStatus.toUpperCase()) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE
          </span>
        );
      case "DEACTIVATED":
      case "INACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-rose-600 dark:text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            DEACTIVATED
          </span>
        );
      case "DRAFT":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            DRAFT
          </span>
        );
    }
  };

  return (
    <div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => {
        const visiblepermissionKeys = role.permissionKeys.slice(0, 3);
        const remainingCount =
          role.permissionKeys.length - visiblepermissionKeys.length;

        return (
          <Card
            key={role.id}
            className="relative flex flex-col justify-between border-border bg-card shadow-xs transition-all hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-card-foreground">
                      {role.name}
                    </CardTitle>
                    {role.isSystem && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                        <Lock className="h-3 w-3" /> System Role
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Badge */}
                  {renderStatusBadge(role.status)}

                  {/* Edit Action Button */}
                  <button
                    type="button"
                    onClick={() => onOpenDetail(role)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                    aria-label="Edit role"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <CardDescription className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                {role.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* User Count */}
              <div className="flex items-center gap-2 border-t border-border/80 pt-3 text-xs text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {role.userCount}
                </span>
                <span>Assigned users</span>
              </div>

              {/* permissionKeys Subset */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  permissionKeys Included
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {visiblepermissionKeys.map((perm, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-1 text-[11px] font-medium text-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {perm}
                    </span>
                  ))}

                  {/* See Details Button */}
                  <button
                    type="button"
                    onClick={() => onOpenDetail(role)}
                    className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10 cursor-pointer"
                  >
                    {remainingCount > 0
                      ? `+${remainingCount} more...`
                      : "See details"}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
     
    </div>
     <Pagination 
                      filter={filter}
                      setFilter={setFilter}
            
                      
                      />
    </div>
  );
}