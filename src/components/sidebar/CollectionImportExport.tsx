"use client";

import { useRef } from "react";
import { useCollections } from "@/contexts/AppContext";
import { downloadCollectionFile, parseImportedCollection, readFileAsText } from "@/lib/collections";
import type { Collection } from "@/types/storage";

interface CollectionImportExportProps {
  collection: Collection;
}

export function CollectionImportExport({ collection }: CollectionImportExportProps) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => downloadCollectionFile(collection)}
        className="rounded px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        title="خروجی JSON"
      >
        خروجی
      </button>
    </div>
  );
}

interface CollectionImporterProps {
  onImported: (message: string) => void;
  onError: (message: string) => void;
}

export function CollectionImporter({ onImported, onError }: CollectionImporterProps) {
  const { importCollection } = useCollections();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await readFileAsText(file);
      const result = parseImportedCollection(text);

      if (!result.ok) {
        onError(result.error);
        return;
      }

      importCollection(result.collection);
      onImported(`مجموعه «${result.collection.name}» با موفقیت وارد شد.`);
    } catch {
      onError("خطا در خواندن فایل.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-3 3m3-3l3 3" />
        </svg>
        وارد کردن مجموعه (JSON)
      </button>
    </>
  );
}
