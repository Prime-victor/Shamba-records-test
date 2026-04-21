import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchAgents } from "../api/auth";
import { assignField, fetchField, fetchFieldUpdates } from "../api/fields";
import { StageBadge } from "../components/StageBadge";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { Field, FieldUpdate, User } from "../types";

export function FieldDetailsPage() {
  const { id = "" } = useParams();
  const { token, user } = useAuth();
  const [field, setField] = useState<Field | null>(null);
  const [updates, setUpdates] = useState<FieldUpdate[]>([]);
  const [assignAgentId, setAssignAgentId] = useState("");
  const [agents, setAgents] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    Promise.all([fetchField(token, id), fetchFieldUpdates(token, id)])
      .then(([fieldResponse, updatesResponse]) => {
        setField(fieldResponse);
        setAssignAgentId(fieldResponse.assigned_agent ? String(fieldResponse.assigned_agent.id) : "");
        setUpdates(updatesResponse);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load field details"));

    if (user?.role === "admin") {
      fetchAgents(token).then(setAgents).catch(() => undefined);
    }
  }, [token, id, user]);

  async function handleAssign(event: FormEvent) {
    event.preventDefault();
    if (!token || !field) return;
    try {
      const updated = await assignField(token, field.id, assignAgentId ? Number(assignAgentId) : null);
      setField(updated);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to assign field");
    }
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 p-4 text-danger">{error}</div>;
  }

  if (!field) {
    return <div className="text-muted">Loading field details...</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
      <section className="rounded-xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary">Field Overview</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">{field.name}</h2>
            <p className="mt-2 text-muted">{field.crop_type}</p>
          </div>
          <div className="flex gap-3">
            <StatusBadge status={field.status} />
            <StageBadge stage={field.stage} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-background p-4">
            <p className="text-sm text-muted">Assigned agent</p>
            <p className="mt-2 font-semibold text-ink">{field.assigned_agent?.name ?? "Unassigned"}</p>
          </div>
          <div className="rounded-xl bg-background p-4">
            <p className="text-sm text-muted">Planting date</p>
            <p className="mt-2 font-semibold text-ink">{new Date(field.planting_date).toLocaleDateString()}</p>
          </div>
        </div>

        {user?.role === "admin" ? (
          <form onSubmit={handleAssign} className="mt-8 rounded-xl border border-border p-5">
            <h3 className="text-lg font-semibold text-ink">Assign Field</h3>
            <p className="mt-1 text-sm text-muted">Choose the agent responsible for the next field visit cycle.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <select
                value={assignAgentId}
                onChange={(event) => setAssignAgentId(event.target.value)}
                className="flex-1 rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
              >
                <option value="">Unassigned</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
              >
                Save assignment
              </button>
            </div>
          </form>
        ) : null}
      </section>

      <section className="rounded-xl border border-border bg-surface p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-ink">Field Updates</h3>
        <div className="mt-5 space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="rounded-xl bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-ink">{update.agent.name}</p>
                <StageBadge stage={update.stage} />
              </div>
              <p className="mt-3 text-sm text-muted">{update.notes}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-muted">
                {new Date(update.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
