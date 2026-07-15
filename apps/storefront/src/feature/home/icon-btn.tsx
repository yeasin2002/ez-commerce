export function IconBtn({
  children,
  label,
  badge,
}: {
  children: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-cloud focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-pill bg-ink px-1 text-[10px] font-semibold text-canvas">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
