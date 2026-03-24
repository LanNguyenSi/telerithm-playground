interface ScenarioButtonProps {
  id: string;
  title: string;
  description: string;
  logCount: number;
  service: string;
  loading: boolean;
  onClick: () => void;
}

export function ScenarioButton({
  title,
  description,
  logCount,
  service,
  loading,
  onClick,
}: ScenarioButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="group rounded-xl border border-border bg-surface p-5 text-left shadow-sm transition hover:border-accent/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p>

      <div className="mt-4 flex items-center justify-between text-[12px]">
        <span className="font-mono text-muted">
          {logCount} logs &middot; {service}
        </span>

        {loading ? (
          <span className="flex items-center gap-1.5 text-accent">
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending
          </span>
        ) : (
          <span className="font-medium text-accent opacity-0 transition group-hover:opacity-100">
            Run &rarr;
          </span>
        )}
      </div>
    </button>
  );
}
