"use client";

import { useState, useCallback } from "react";
import { MethodSelector } from "./MethodSelector";
import { UrlInput, validateUrlForSend } from "./UrlInput";
import { useActiveRequest } from "@/contexts/AppContext";
import {
  buildUrlWithParams,
  extractBaseUrl,
  syncParamsWithUrl,
} from "@/lib/url";

interface RequestBarProps {
  onSend?: (finalUrl: string) => void;
  isLoading?: boolean;
}

export function RequestBar({ onSend, isLoading = false }: RequestBarProps) {
  const { tab, setMethod, setUrl, setParams } = useActiveRequest();
  const [sendError, setSendError] = useState<string | null>(null);

  const handleUrlBlur = useCallback(() => {
    const synced = syncParamsWithUrl(tab.url, tab.params);
    setUrl(synced.baseUrl);
    if (synced.params.length > 0 && synced.params.some((p) => p.key)) {
      setParams(synced.params);
    }
  }, [tab.url, tab.params, setUrl, setParams]);

  const handleSend = useCallback(() => {
    const finalUrl = buildUrlWithParams(tab.url, tab.params);
    const validationError = validateUrlForSend(finalUrl);

    if (validationError) {
      setSendError(validationError);
      return;
    }

    setSendError(null);
    onSend?.(finalUrl);
  }, [tab.url, tab.params, onSend]);

  const previewUrl = buildUrlWithParams(tab.url, tab.params);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <MethodSelector value={tab.method} onChange={setMethod} />
        <UrlInput
          value={tab.url}
          onChange={setUrl}
          onBlurSync={handleUrlBlur}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              در حال ارسال...
            </>
          ) : (
            "ارسال"
          )}
        </button>
      </div>

      {sendError && (
        <p className="text-xs text-red-500" role="alert">
          {sendError}
        </p>
      )}

      {previewUrl && previewUrl !== tab.url && (
        <div className="rounded-md bg-surface-muted px-3 py-2">
          <p className="mb-1 text-xs text-muted-foreground">URL نهایی:</p>
          <p className="break-all text-xs font-mono text-foreground" dir="ltr">
            {previewUrl}
          </p>
        </div>
      )}
    </div>
  );
}

export { extractBaseUrl };
