import type { RequestError } from "@/types/response";

interface ErrorAlertProps {
  error: RequestError;
}

const ERROR_ICONS: Record<RequestError["type"], string> = {
  validation: "⚠",
  network: "✕",
  cors: "⊘",
  timeout: "⏱",
  abort: "⏹",
  unknown: "?",
};

const ERROR_TITLES: Record<RequestError["type"], string> = {
  validation: "خطای اعتبارسنجی",
  network: "خطای شبکه",
  cors: "خطای CORS",
  timeout: "اتمام زمان",
  abort: "لغو درخواست",
  unknown: "خطای ناشناخته",
};

export function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <div
      className="rounded-lg border border-red-500/30 bg-red-500/10 p-4"
      role="alert"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-xs text-red-500">
          {ERROR_ICONS[error.type]}
        </span>
        <h3 className="text-sm font-semibold text-red-500">
          {ERROR_TITLES[error.type]}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-red-400/90">{error.message}</p>
    </div>
  );
}
