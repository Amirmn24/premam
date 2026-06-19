"use client";

import { useState, useCallback } from "react";
import { MethodSelector } from "./MethodSelector";
import { UrlInput, validateUrlForSend } from "./UrlInput";
import { useActiveRequest, useTabs } from "@/contexts/AppContext";
import {
  buildUrlWithParams,
  syncParamsWithUrl,
} from "@/lib/url";

interface RequestBarProps {
  onSend?: (finalUrl: string) => void | Promise<void>;
  isLoading?: boolean;
  onClearResponse?: () => void;
}

export function RequestBar({
  onSend,
  isLoading = false,
  onClearResponse,
}: RequestBarProps) {
  const { tab, setMethod, setUrl, setParams } = useActiveRequest();
  const { resetActiveTab } = useTabs();
  const [sendError, setSendError] = useState<string | null>(null);

  const handleUrlBlur = useCallback(() => {
    const synced = syncParamsWithUrl(tab.url, tab.params);
    setUrl(synced.baseUrl);
    if (synced.params.length > 0 && synced.params.some((p) => p.key)) {
      setParams(synced.params);
    }
  }, [tab.url, tab.params, setUrl, setParams]);

  const handleSend = useCallback(async () => {
    const finalUrl = buildUrlWithParams(tab.url, tab.params);
    const validationError = validateUrlForSend(finalUrl);

    if (validationError) {
      setSendError(validationError);
      return;
    }

    setSendError(null);
    await onSend?.(finalUrl);
  }, [tab.url, tab.params, onSend]);

  const handleReset = useCallback(() => {
    if (!confirm("همه فیلدهای درخواست (URL، پارامترها، هدرها و بدنه) پاک شوند؟")) {
      return;
    }
    resetActiveTab();
    setSendError(null);
    onClearResponse?.();
  }, [resetActiveTab, onClearResponse]);

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
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            title="پاک کردن همه فیلدها"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">پاک کردن</span>
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
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
