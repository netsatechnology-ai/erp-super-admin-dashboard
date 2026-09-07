"use client";

import { useState } from "react";
import {
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Power,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  merchant: string;
  role: string;
  status: "Active" | "Inactive";
  lastActive: string;
  createdAt: string;
}

interface UsersTableProps {
  users: UserItem[];
  availableRoles: string[];
  onToggleStatus: (userId: string) => void;
  onRoleChange: (userId: string, newRole: string) => void;
}

export function UsersTable({
  users,
  availableRoles,
  onToggleStatus,
  onRoleChange,
}: UsersTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Calculate slice range for current page
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Ensure current page stays within valid range if user array changes externally
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setActiveMenuId(null);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    setActiveMenuId(null);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                User Profile
              </th>
              <th scope="col" className="px-6 py-3.5">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3.5">
                Last Active
              </th>
              <th scope="col" className="px-6 py-3.5">
                Role Assigned
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-xs text-muted-foreground"
                >
                  No users match your search or filter criteria.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => {
                const initials =
                  `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                const isMenuOpen = activeMenuId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    {/* Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-semibold text-foreground leading-tight block">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Added {user.createdAt}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <span>{user.phone || "N/A"}</span>
                      </div>
                    </td>

                    {/* Last Active */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span>{user.lastActive}</span>
                      </div>
                    </td>

                    {/* Role Selector */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                        <select
                          value={user.role}
                          onChange={(e) =>
                            onRoleChange(user.id, e.target.value)
                          }
                          className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-accent focus:outline-hidden focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                          {availableRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {user.status === "Active" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions Menu */}
                    <td className="relative px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : user.id)
                        }
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                        aria-label="Actions menu"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-6 top-12 z-20 w-44 rounded-xl border border-border bg-card p-1.5 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              onToggleStatus(user.id);
                              setActiveMenuId(null);
                            }}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                              user.status === "Active"
                                ? "text-amber-600 hover:bg-amber-500/10"
                                : "text-emerald-600 hover:bg-emerald-500/10"
                            }`}
                          >
                            <Power className="h-3.5 w-3.5" />
                            <span>
                              {user.status === "Active"
                                ? "Deactivate User"
                                : "Activate User"}
                            </span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      {totalItems > 0 && (
        <div className="flex flex-col gap-4 border-t border-border px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Item Count Information */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Showing{" "}
              <strong className="font-semibold text-foreground">
                {startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong className="font-semibold text-foreground">
                {endIndex}
              </strong>{" "}
              of{" "}
              <strong className="font-semibold text-foreground">
                {totalItems}
              </strong>{" "}
              users
            </span>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring cursor-pointer"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pagination Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="mr-2 text-xs font-medium text-muted-foreground">
              Page {validCurrentPage} of {totalPages}
            </span>

            {/* First Page */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => handlePageChange(1)}
              disabled={validCurrentPage === 1}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Previous Page */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Next Page */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Last Page */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => handlePageChange(totalPages)}
              disabled={validCurrentPage === totalPages}
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}