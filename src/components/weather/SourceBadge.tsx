export function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center rounded-pill border border-border bg-bg px-2.5 py-0.5 text-xs font-medium text-ink-2">
      {source}
    </span>
  );
}
