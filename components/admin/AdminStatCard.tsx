type AdminStatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  highlighted?: boolean;
  compact?: boolean;
};

export default function AdminStatCard({
  title,
  value,
  subtitle,
  icon,
  highlighted = false,
  compact = false,
}: AdminStatCardProps) {
  const cardClasses = highlighted
    ? 'bg-primary text-white shadow-[0_18px_40px_rgba(38,65,145,0.2)]'
    : 'bg-white text-on-surface shadow-[0_10px_24px_rgba(38,65,145,0.06)]';

  const titleClasses = highlighted ? 'text-white/85' : 'text-on-surface-variant';
  const subtitleClasses = highlighted ? 'text-white/70' : 'text-on-surface-variant';
  const badgeClasses = highlighted
    ? 'bg-white/15 text-white'
    : 'bg-primary-container text-primary';

  return (
    <article
      className={`relative overflow-hidden rounded-xl border border-outline-variant/70 px-5 py-4 ${cardClasses} ${
        compact ? 'min-h-[108px]' : 'min-h-[122px]'
      }`}
    >
      {highlighted && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-xl bg-white/12" />
      )}
      {!highlighted && (
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-xl bg-primary-container/70" />
      )}

      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-sm text-[20px] ${badgeClasses}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <span className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${titleClasses}`}>{title}</span>
        </div>

        <div className="space-y-1">
          <p className={`text-xl font-semibold tracking-[-0.04em] ${highlighted ? 'text-white' : 'text-on-surface'}`}>
            {value}
          </p>
          <p className={`text-sm ${subtitleClasses}`}>{subtitle}</p>
        </div>
      </div>
    </article>
  );
}
