"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  inlinePrefix?: React.ReactNode;
  containerClassName?: string;
  error?: string;
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    { label, icon: Icon, inlinePrefix, id, className, containerClassName, error, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          {/* Visible Standalone Prefix Box */}
          {inlinePrefix && (
            <div className="flex h-9 shrink-0 items-center justify-center rounded-md border border-input  px-3 text-sm font-medium text-foreground  select-none">
              {inlinePrefix}
            </div>
          )}

          <div className="relative w-full">
            {Icon && (
              <Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            )}
            <Input
              id={inputId}
              ref={ref}
              className={cn(Icon && "pl-9", className)}
              {...props}
            />
          </div>
        </div>
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";