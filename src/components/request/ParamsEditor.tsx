"use client";

import type { KeyValuePair } from "@/types/request";
import { KeyValueEditor } from "./KeyValueEditor";

interface ParamsEditorProps {
  params: KeyValuePair[];
  onChange: (params: KeyValuePair[]) => void;
}

export function ParamsEditor({ params, onChange }: ParamsEditorProps) {
  return (
    <KeyValueEditor
      items={params}
      onChange={onChange}
      addLabel="افزودن پارامتر"
      enableAriaLabel="فعال‌سازی پارامتر"
      removeAriaLabel="حذف پارامتر"
    />
  );
}
