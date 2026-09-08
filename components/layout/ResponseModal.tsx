"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { hideResponseModal } from "@/lib/redux/slices/responseModalSlice";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResponseModal() {
  const dispatch = useAppDispatch();
  const { isOpen, status, title, message, buttonText, onConfirm } = useAppSelector(
    (state) => state.responseModal
  );

  if (!isOpen) return null;

  const handleClose = () => {
    if (onConfirm) {
      onConfirm();
    }
    dispatch(hideResponseModal());
  };

  const statusConfigs = {
    success: {
      icon: CheckCircle2,
      iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400",
      btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
      defaultTitle: "Operation Successful",
    },
    error: {
      icon: AlertCircle,
      iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400",
      btnClass: "bg-rose-600 hover:bg-rose-700 text-white",
      defaultTitle: "Operation Failed",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400",
      btnClass: "bg-amber-600 hover:bg-amber-700 text-white",
      defaultTitle: "Warning",
    },
    info: {
      icon: Info,
      iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400",
      btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
      defaultTitle: "Notice",
    },
  };

  const config = statusConfigs[status] || statusConfigs.info;
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 transition-opacity">
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all">
        <button
          onClick={() => dispatch(hideResponseModal())}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${config.iconBg}`}>
            <IconComponent className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-foreground">
              {title || config.defaultTitle}
            </h3>
            {message && (
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                {message}
              </p>
            )}
          </div>

          <Button
            onClick={handleClose}
            className={`w-full text-xs font-bold rounded-xl cursor-pointer shadow-2xs ${config.btnClass}`}
          >
            {buttonText || "OK"}
          </Button>
        </div>
      </div>
    </div>
  );
}