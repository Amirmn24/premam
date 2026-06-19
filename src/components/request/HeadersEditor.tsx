"use client";

import type { KeyValuePair } from "@/types/request";
import { KeyValueEditor } from "./KeyValueEditor";

interface HeadersEditorProps {
  headers: KeyValuePair[];
  onChange: (headers: KeyValuePair[]) => void;
}

export function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  return (
    <KeyValueEditor
      items={headers}
      onChange={onChange}
      addLabel="افزودن هدر"
      keyPlaceholder="مثال: Content-Type"
      valuePlaceholder="مثال: application/json"
      enableAriaLabel="فعال‌سازی هدر"
      removeAriaLabel="حذف هدر"
    />
  );
}
