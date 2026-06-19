"use client";

import { useState, useCallback } from "react";
import { validateUrl } from "@/lib/url";

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
  onBlurSync?: () => void;
}

export function UrlInput({ value, onChange, onBlurSync }: UrlInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleBlur = useCallback(() => {
    setTouched(true);
    const result = validateUrl(value);
    setError(result.valid ? null : (result.error ?? null));
    onBlurSync?.();
  }, [value, onBlurSync]);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
      if (touched) {
        const result = validateUrl(newValue);
        setError(result.valid ? null : (result.error ?? null));
      }
    },
    [onChange, touched],
  );

  return (
    <div className="min-w-0 flex-1">
      <input
        type="url"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="https://api.example.com/endpoint"
        className={`h-10 w-full rounded-lg border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 ${
          error && touched
            ? "border-red-500 focus:ring-red-500/30"
            : "border-border focus:border-accent"
        }`}
        dir="ltr"
        spellCheck={false}
        aria-label="آدرس URL"
        aria-invalid={!!error && touched}
      />
      {error && touched && (
        <p className="mt-1.5 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function validateUrlForSend(url: string): string | null {
  const result = validateUrl(url);
  return result.valid ? null : (result.error ?? "آدرس نامعتبر است.");
}
