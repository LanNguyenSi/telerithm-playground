interface LogCounterProps {
  count: number;
}

export function LogCounter({ count }: LogCounterProps) {
  return (
    <div className="flex items-center justify-center gap-4 rounded-xl border border-border bg-surface px-6 py-5 shadow-sm">
      <div className="font-mono text-4xl font-semibold tabular-nums text-accent">
        {count.toLocaleString()}
      </div>
      <div className="text-sm text-muted">
        logs sent
      </div>
    </div>
  );
}
