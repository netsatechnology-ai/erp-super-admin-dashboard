"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 400,
  className = "",
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal state if external value changes (e.g. form reset)
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [internalValue, onChange, value, debounceMs]);

  return (
    <div className={`relative min-w-64 flex-1 ${className}`}>
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        className="w-full rounded-xl border border-transparent bg-indigo-50/50 dark:bg-slate-800/60 py-2 pl-10 pr-4 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
      />
    </div>
  );
}