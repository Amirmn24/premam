"use client";

import { useState } from "react";
import {
  useActiveRequest,
  useCollections,
  useHistory,
} from "@/contexts/AppContext";
import { METHOD_COLORS } from "@/lib/constants";
import { CollectionImportExport, CollectionImporter } from "./CollectionImportExport";
import { getStatusCategory } from "@/lib/http";

type SidebarSection = "collections" | "history";

function formatTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function truncateUrl(url: string, max = 40): string {
  if (url.length <= max) return url;
  return `${url.slice(0, max)}…`;
}

export function Sidebar() {
  const [section, setSection] = useState<SidebarSection>("collections");
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [saveTarget, setSaveTarget] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { tab } = useActiveRequest();
  const {
    collections,
    createCollection,
    deleteCollection,
    saveCurrentToCollection,
    loadRequestFromCollection,
    deleteRequestFromCollection,
  } = useCollections();
  const { history, clearHistory, loadFromHistory, removeHistoryEntry } = useHistory();

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    createCollection(newCollectionName);
    setNewCollectionName("");
    showFeedback("success", "مجموعه جدید ایجاد شد.");
  };

  const handleSaveToCollection = (collectionId: string) => {
    saveCurrentToCollection(collectionId, tab, saveName.trim() || tab.name);
    setSaveTarget(null);
    setSaveName("");
    showFeedback("success", "درخواست در مجموعه ذخیره شد.");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setSection("collections")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
            section === "collections"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          مجموعه‌ها
        </button>
        <button
          type="button"
          onClick={() => setSection("history")}
          className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
            section === "history"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          تاریخچه
        </button>
      </div>

      {feedback && (
        <div
          className={`mx-3 mt-3 rounded-lg px-3 py-2 text-xs ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="flex-1 overflow-auto p-3">
        {section === "collections" && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="نام مجموعه جدید"
                className="h-8 min-w-0 flex-1 rounded-md border border-border bg-surface px-2 text-xs focus:border-accent focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
              />
              <button
                type="button"
                onClick={handleCreateCollection}
                className="shrink-0 rounded-md bg-accent px-3 text-xs font-medium text-white hover:bg-accent-hover"
              >
                +
              </button>
            </div>

            <CollectionImporter
              onImported={(msg) => showFeedback("success", msg)}
              onError={(msg) => showFeedback("error", msg)}
            />

            {collections.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                مجموعه‌ای وجود ندارد.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="rounded-lg border border-border bg-surface-muted/30"
                  >
                    <div className="flex items-center gap-1 px-2 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCollection((prev) =>
                            prev === collection.id ? null : collection.id,
                          )
                        }
                        className="flex min-w-0 flex-1 items-center gap-1.5 text-right text-xs font-medium"
                      >
                        <svg
                          className={`h-3 w-3 shrink-0 transition-transform ${
                            expandedCollection === collection.id ? "rotate-90" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="truncate">{collection.name}</span>
                        <span className="text-muted-foreground">
                          ({collection.requests.length})
                        </span>
                      </button>
                      <CollectionImportExport collection={collection} />
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`مجموعه «${collection.name}» حذف شود؟`)) {
                            deleteCollection(collection.id);
                          }
                        }}
                        className="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                        aria-label="حذف مجموعه"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {expandedCollection === collection.id && (
                      <div className="border-t border-border px-2 pb-2">
                        {saveTarget === collection.id ? (
                          <div className="mt-2 flex flex-col gap-2">
                            <input
                              type="text"
                              value={saveName}
                              onChange={(e) => setSaveName(e.target.value)}
                              placeholder="نام درخواست"
                              className="h-8 rounded-md border border-border bg-surface px-2 text-xs focus:border-accent focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveToCollection(collection.id)}
                                className="flex-1 rounded-md bg-accent py-1.5 text-xs text-white"
                              >
                                ذخیره
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSaveTarget(null);
                                  setSaveName("");
                                }}
                                className="flex-1 rounded-md border border-border py-1.5 text-xs"
                              >
                                انصراف
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSaveTarget(collection.id);
                              setSaveName(tab.name);
                            }}
                            className="mt-2 w-full rounded-md border border-dashed border-border py-1.5 text-xs text-accent hover:bg-accent/5"
                          >
                            ذخیره درخواست فعلی
                          </button>
                        )}

                        {collection.requests.length === 0 ? (
                          <p className="mt-2 text-center text-[11px] text-muted-foreground">
                            درخواستی ذخیره نشده
                          </p>
                        ) : (
                          <ul className="mt-2 flex flex-col gap-1">
                            {collection.requests.map((request) => (
                              <li
                                key={request.id}
                                className="group flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-surface-muted"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-medium">{request.name}</p>
                                  <p className="truncate text-[10px] text-muted-foreground" dir="ltr">
                                    <span className={METHOD_COLORS[request.method]}>
                                      {request.method}
                                    </span>{" "}
                                    {truncateUrl(request.url, 28)}
                                  </p>
                                </div>
                                <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                  <button
                                    type="button"
                                    title="بارگذاری در تب فعلی"
                                    onClick={() =>
                                      loadRequestFromCollection(
                                        collection.id,
                                        request.id,
                                        "current",
                                      )
                                    }
                                    className="rounded p-1 text-muted-foreground hover:text-accent"
                                  >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    title="باز کردن در تب جدید"
                                    onClick={() =>
                                      loadRequestFromCollection(
                                        collection.id,
                                        request.id,
                                        "new",
                                      )
                                    }
                                    className="rounded p-1 text-muted-foreground hover:text-accent"
                                  >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    title="حذف"
                                    onClick={() =>
                                      deleteRequestFromCollection(collection.id, request.id)
                                    }
                                    className="rounded p-1 text-muted-foreground hover:text-red-500"
                                  >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section === "history" && (
          <div className="flex flex-col gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("تمام تاریخچه پاک شود؟")) clearHistory();
                }}
                className="self-end text-[11px] text-red-500 hover:underline"
              >
                پاک کردن تاریخچه
              </button>
            )}

            {history.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                تاریخچه‌ای وجود ندارد.
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {history.map((entry) => {
                  const statusClass =
                    entry.status !== undefined
                      ? getStatusCategory(entry.status) === "success"
                        ? "text-emerald-500"
                        : getStatusCategory(entry.status) === "client"
                          ? "text-amber-500"
                          : "text-red-500"
                      : "text-muted-foreground";

                  return (
                    <li
                      key={entry.id}
                      className="group flex items-start gap-2 rounded-lg border border-border px-2 py-2 hover:bg-surface-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${METHOD_COLORS[entry.method]}`}>
                            {entry.method}
                          </span>
                          {entry.status !== undefined && (
                            <span className={`text-xs font-mono ${statusClass}`}>
                              {entry.status}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[11px] text-foreground" dir="ltr" title={entry.url}>
                          {entry.url}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatTime(entry.timestamp)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          title="بارگذاری"
                          onClick={() => loadFromHistory(entry.id, "current")}
                          className="rounded p-1 text-muted-foreground hover:text-accent"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          title="تب جدید"
                          onClick={() => loadFromHistory(entry.id, "new")}
                          className="rounded p-1 text-muted-foreground hover:text-accent"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          title="حذف"
                          onClick={() => removeHistoryEntry(entry.id)}
                          className="rounded p-1 text-muted-foreground hover:text-red-500"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 border-b border-border bg-surface-muted/30 px-4 py-2 text-xs text-muted-foreground lg:hidden"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        مجموعه‌ها و تاریخچه
      </button>

      <aside className="hidden w-72 shrink-0 flex-col border-l border-border bg-surface-elevated lg:flex">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute bottom-0 left-0 right-0 flex max-h-[70vh] flex-col rounded-t-2xl bg-surface-elevated">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-medium">مجموعه‌ها و تاریخچه</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-surface-muted"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </aside>
        </div>
      )}
    </>
  );
}
