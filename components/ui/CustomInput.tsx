"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label?: string;
  requiredStar?: boolean;
  topRightBadge?: React.ReactNode;
  icon?: LucideIcon;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inlinePrefix?: React.ReactNode;
  containerClassName?: string;
  error?: string;
  as?: "input" | "select"; // Added polymorphic support
  children?: React.ReactNode; // For <option> tags when as="select"
}

export const CustomInput = React.forwardRef<
  HTMLInputElement & HTMLSelectElement,
  CustomInputProps
>(
  (
    {
      label,
      requiredStar = false,
      topRightBadge,
      icon: Icon,
      leftIcon,
      rightIcon,
      inlinePrefix,
      id,
      className,
      containerClassName,
      error,
      as = "input",
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const renderLeftIcon = () => {
      if (leftIcon) {
        return (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center z-10">
            {leftIcon}
          </div>
        );
      }
      if (Icon) {
        return (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        );
      }
      return null;
    };

    const hasLeftIcon = Boolean(leftIcon || Icon);

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {/* Header Row */}
        {(label || topRightBadge) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={inputId}
                className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                {label} {requiredStar && <span className="text-rose-500">*</span>}
              </label>
            )}
            {topRightBadge && <div>{topRightBadge}</div>}
          </div>
        )}

        <div className="flex items-center gap-2">
          {inlinePrefix && (
            <div className="flex h-9 shrink-0 items-center justify-center rounded-md border border-input px-3 text-sm font-medium text-foreground select-none">
              {inlinePrefix}
            </div>
          )}

          <div className="relative w-full">
            {renderLeftIcon()}

            {as === "select" ? (
              <select
                id={inputId}
                ref={ref}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer font-semibold text-foreground",
                  hasLeftIcon && "pl-9",
                  rightIcon && "pr-9",
                  className
                )}
                {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
              >
                {children}
              </select>
            ) : (
              <Input
                id={inputId}
                ref={ref}
                className={cn(
                  hasLeftIcon && "pl-9",
                  rightIcon && "pr-9",
                  className
                )}
                {...props}
              />
            )}

            {rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";