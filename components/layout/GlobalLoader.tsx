"use client";

import React from "react";
import { useAppSelector } from "@/lib/redux/store";
import { RefreshCw } from "lucide-react";

export function GlobalLoader() {
    const { isLoading, message } = useAppSelector((state) => state.loading);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs transition-opacity duration-200">
            <div className={`flex flex-col items-center  rounded-2xl border border-border bg-card shadow-xl max-w-xs text-center ${message ? "pt-5" : ""}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
                <div>

                    {message && <p className="text-xs text-muted-foreground mt-0.5">
                        {message}
                    </p>}

                </div>
            </div>
        </div>
    );
}