import type { KeyValuePair } from "@/types/request";
import { createId } from "@/lib/url";

export function createEmptyKeyValue(): KeyValuePair {
  return { id: createId(), key: "", value: "", enabled: true };
}

export function keyValuesToRecord(items: KeyValuePair[]): Record<string, string> {
  const record: Record<string, string> = {};

  items
    .filter((item) => item.enabled && item.key.trim())
    .forEach((item) => {
      record[item.key.trim()] = item.value;
    });

  return record;
}
