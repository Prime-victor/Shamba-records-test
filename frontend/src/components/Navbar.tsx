import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const { user } = useAuth();
  const title = !user ? "SmartSeason" : user.role === "admin" ? "Admin Control Room" : "Agent Field View";

  return (
    <header className="mb-8 rounded-xl border border-border bg-surface px-6 py-5 shadow-soft">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary">SmartSeason Field Monitoring System</p>
          <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        </div>
        <div className="rounded-xl bg-background px-4 py-3 text-right">
          <p className="text-sm font-medium text-ink">{user?.name}</p>
          <p className="text-sm text-muted">{user?.role === "admin" ? "Administrator" : "Field Agent"}</p>
        </div>
      </div>
    </header>
  );
}
