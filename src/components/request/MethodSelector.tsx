"use client";

import { useState, useRef, useEffect } from "react";
import type { HttpMethod } from "@/types/request";
import { HTTP_METHODS, METHOD_BG_COLORS, METHOD_COLORS } from "@/lib/constants";

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-10 min-w-[110px] items-center justify-between gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors ${METHOD_BG_COLORS[value]} ${METHOD_COLORS[value]}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="انتخاب متد HTTP"
      >
        <span>{value}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg"
        >
          {HTTP_METHODS.map((method) => (
            <li key={method} role="option" aria-selected={method === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(method);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-muted ${METHOD_COLORS[method]} ${
                  method === value ? "bg-surface-muted" : ""
                }`}
              >
                {method}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
