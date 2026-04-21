import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchAdminDashboard, fetchAgentDashboard } from "../api/fields";
import { DashboardCard } from "../components/DashboardCard";
import { StageBadge } from "../components/StageBadge";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { DashboardSummary } from "../types";

export function DashboardPage() {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    const request = user.role === "admin" ? fetchAdminDashboard(token) : fetchAgentDashboard(token);
    request.then(setSummary).catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard");
    });
  }, [token, user]);

  if (error) {
    return <div className="rounded-xl bg-red-50 p-4 text-danger">{error}</div>;
  }

  if (!summary || !user) {
    return <div className="text-muted">Loading dashboard insights...</div>;
  }

  const leadValue = user.role === "admin" ? summary.total_fields ?? 0 : summary.assigned_fields ?? 0;
  const leadTitle = user.role === "admin" ? "Total Fields" : "Assigned Fields";

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title={leadTitle} value={leadValue} accent="bg-slate-400" helper="Current field coverage" />
        <DashboardCard title="Active" value={summary.active_fields} accent="bg-success" helper="Healthy monitoring pace" />
        <DashboardCard title="At Risk" value={summary.at_risk_fields} accent="bg-danger" helper="Needs action soon" />
        <DashboardCard title="Completed" value={summary.completed_fields} accent="bg-info" helper="Harvest milestones reached" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">Recent Fields</h2>
              <p className="text-sm text-muted">Quick scan of the latest field activity.</p>
            </div>
            <Link to="/fields" className="text-sm font-medium text-primary">
              View all fields
            </Link>
          </div>

          <div className="space-y-4">
            {summary.recent_fields.map((field) => (
              <div key={field.id} className="rounded-xl border border-border px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{field.name}</p>
                    <p className="text-sm text-muted">{field.crop_type}</p>
                  </div>
                  <StatusBadge status={field.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <StageBadge stage={field.stage} />
                  <span className="text-sm text-muted">{field.assigned_agent ?? "Unassigned"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-ink">Stage Breakdown</h2>
            <div className="mt-5 space-y-4">
              {Object.entries(summary.stage_breakdown).map(([stage, total]) => (
                <div key={stage}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted">{stage}</span>
                    <span className="font-medium text-ink">{total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-background">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.max(total * 18, 14)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {summary.recent_updates ? (
            <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-ink">Recent Agent Updates</h2>
              <div className="mt-5 space-y-4">
                {summary.recent_updates.map((update) => (
                  <div key={`${update.field}-${update.created_at}`} className="rounded-xl bg-background p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-ink">{update.field}</p>
                      <StageBadge stage={update.stage} />
                    </div>
                    <p className="mt-2 text-sm text-muted">{update.notes}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
                      {new Date(update.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
