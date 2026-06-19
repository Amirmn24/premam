import type { StatusCategory } from "@/types/response";
import { getStatusCategory, getStatusLabel } from "@/lib/http";

interface StatusBadgeProps {
  status: number;
  statusText?: string;
}

const CATEGORY_STYLES: Record<StatusCategory, string> = {
  success: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  redirect: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  client: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  server: "bg-red-500/15 text-red-500 border-red-500/30",
  unknown: "bg-surface-muted text-muted-foreground border-border",
};

const LABEL_COLORS: Record<StatusCategory, string> = {
  success: "text-emerald-500",
  redirect: "text-blue-500",
  client: "text-amber-500",
  server: "text-red-500",
  unknown: "text-muted-foreground",
};

export function StatusBadge({ status, statusText }: StatusBadgeProps) {
  const category = getStatusCategory(status);
  const label = getStatusLabel(category);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm font-bold ${CATEGORY_STYLES[category]}`}
        aria-label={`کد وضعیت ${status}`}
      >
        <span>{status}</span>
        {statusText && (
          <span className="text-xs font-normal opacity-80">{statusText}</span>
        )}
      </span>
      <span className={`text-xs font-medium ${LABEL_COLORS[category]}`}>
        {label}
      </span>
    </div>
  );
}
