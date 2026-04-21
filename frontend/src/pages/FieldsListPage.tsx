import { FormEvent, useEffect, useState } from "react";

import { fetchAgents } from "../api/auth";
import { createField, fetchFields } from "../api/fields";
import { FieldCard } from "../components/FieldCard";
import { useAuth } from "../hooks/useAuth";
import { Field, FieldStage, User } from "../types";

const emptyForm = {
  name: "",
  crop_type: "",
  planting_date: "",
  stage: "Planted" as FieldStage,
  assigned_agent_id: null as number | null,
};

export function FieldsListPage() {
  const { token, user } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!token) return;
    fetchFields(token)
      .then(setFields)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load fields"));

    if (user?.role === "admin") {
      fetchAgents(token).then(setAgents).catch(() => undefined);
    }
  }, [token, user]);

  const filtered = fields.filter((field) => {
    const value = `${field.name} ${field.crop_type} ${field.status}`.toLowerCase();
    return value.includes(query.toLowerCase());
  });

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    try {
      const nextField = await createField(token, form);
      setFields((current) => [nextField, ...current]);
      setForm(emptyForm);
      setShowForm(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create field");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Field Registry</h2>
          <p className="text-sm text-muted">Track crop stages, ownership, and operational risk across every plot.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Search fields"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
          />
          {user?.role === "admin" ? (
            <button
              type="button"
              onClick={() => setShowForm((current) => !current)}
              className="rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
            >
              {showForm ? "Close form" : "Add field"}
            </button>
          ) : null}
        </div>
      </div>

      {error ? <div className="rounded-xl bg-red-50 p-4 text-danger">{error}</div> : null}

      {showForm ? (
        <form onSubmit={handleCreate} className="grid gap-4 rounded-xl border border-border bg-surface p-6 shadow-soft md:grid-cols-2">
          <input
            required
            placeholder="Field name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
          />
          <input
            required
            placeholder="Crop type"
            value={form.crop_type}
            onChange={(event) => setForm((current) => ({ ...current, crop_type: event.target.value }))}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
          />
          <input
            type="date"
            required
            value={form.planting_date}
            onChange={(event) => setForm((current) => ({ ...current, planting_date: event.target.value }))}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
          />
          <select
            value={form.stage}
            onChange={(event) => setForm((current) => ({ ...current, stage: event.target.value as FieldStage }))}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
          >
            <option>Planted</option>
            <option>Growing</option>
            <option>Ready</option>
            <option>Harvested</option>
          </select>
          <select
            value={form.assigned_agent_id ?? ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                assigned_agent_id: event.target.value ? Number(event.target.value) : null,
              }))
            }
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
          >
            <option value="">Assign later</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark md:col-span-2"
          >
            Save field
          </button>
        </form>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
}
