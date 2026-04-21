import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchFields, submitFieldUpdate } from "../api/fields";
import { useAuth } from "../hooks/useAuth";
import { Field, FieldStage } from "../types";

export function UpdateFormPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState("");
  const [stage, setStage] = useState<FieldStage>("Growing");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchFields(token)
      .then((response) => {
        setFields(response);
        if (response[0]) {
          setSelectedField(String(response[0].id));
          setStage(response[0].stage);
        }
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load assigned fields"));
  }, [token]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token || !selectedField) return;
    try {
      await submitFieldUpdate(token, selectedField, { stage, notes });
      navigate(`/fields/${selectedField}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit update");
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-ink">Submit Field Update</h2>
      <p className="mt-2 text-sm text-muted">Capture the latest crop stage and on-ground notes for your assigned field.</p>

      {error ? <div className="mt-5 rounded-xl bg-red-50 p-4 text-danger">{error}</div> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Field</span>
          <select
            value={selectedField}
            onChange={(event) => setSelectedField(event.target.value)}
            className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
          >
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Stage</span>
          <select
            value={stage}
            onChange={(event) => setStage(event.target.value as FieldStage)}
            className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
          >
            <option>Planted</option>
            <option>Growing</option>
            <option>Ready</option>
            <option>Harvested</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Field notes</span>
          <textarea
            required
            rows={5}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
            placeholder="Describe crop condition, weather effects, pest concerns, or progress."
          />
        </label>

        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
        >
          Save update
        </button>
      </form>
    </div>
  );
}
