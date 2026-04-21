interface DashboardCardProps {
  title: string;
  value: number;
  accent: string;
  helper: string;
}

export function DashboardCard({ title, value, accent, helper }: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-soft">
      <div className={`mb-4 h-1.5 w-14 rounded-full ${accent}`} />
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{helper}</p>
    </div>
  );
}
