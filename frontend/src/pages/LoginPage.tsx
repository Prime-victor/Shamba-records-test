import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";

export function LoginPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent" as UserRole,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to continue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-[28px] bg-sidebar p-8 text-white shadow-soft">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-secondary-light">SmartSeason</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Calm, data-first monitoring for modern farm operations.
            </h1>
            <p className="mt-5 text-base text-slate-300">
              Track field conditions, monitor agent activity, and spot risks before they disrupt harvest timelines.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Field visibility", "Every assigned field and crop stage in one workspace."],
              ["Risk detection", "Spot stale updates and delayed planting progress quickly."],
              ["Agent reporting", "Capture field notes directly from operational teams."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="h-10 w-10 rounded-xl bg-primary/20" />
                <h2 className="mt-4 text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-border bg-surface p-8 shadow-soft">
          <div className="mb-8 flex rounded-xl bg-background p-1">
            {(["login", "register"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold capitalize transition ${
                  mode === option ? "bg-primary text-white" : "text-muted"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Full name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">Password</span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>

            {mode === "register" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Role</span>
                <select
                  value={form.role}
                  onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as UserRole }))}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary"
                >
                  <option value="agent">Field Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            ) : null}

            {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-70"
            >
              {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

        </section>
      </div>
    </div>
  );
}
