export function ResponsePanel() {
  return (
    <div className="flex min-h-[200px] flex-1 flex-col border-t border-border lg:min-h-0 lg:border-l lg:border-t-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-semibold text-foreground">پاسخ</h2>
        <span className="text-xs text-muted-foreground">در مرحله بعد پیاده‌سازی می‌شود</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">
          درخواستی ارسال نشده است.
          <br />
          پس از ارسال، کد وضعیت و محتوای پاسخ اینجا نمایش داده می‌شود.
        </p>
      </div>
    </div>
  );
}
