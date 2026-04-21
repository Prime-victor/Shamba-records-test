import { NavLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const navBase =
  "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition";

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex min-h-screen w-full flex-col bg-sidebar px-5 py-8 text-sidebar-text md:w-72">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.28em] text-secondary-light">Field Intelligence</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">SmartSeason</h2>
        <p className="mt-2 text-sm text-slate-400">Monitor field health, agent activity, and crop progress in one view.</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${navBase} ${isActive ? "bg-primary text-white" : "hover:bg-slate-800"}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/fields"
          className={({ isActive }) => `${navBase} ${isActive ? "bg-primary text-white" : "hover:bg-slate-800"}`}
        >
          Fields
        </NavLink>
        {user?.role === "agent" ? (
          <NavLink
            to="/updates/new"
            className={({ isActive }) => `${navBase} ${isActive ? "bg-primary text-white" : "hover:bg-slate-800"}`}
          >
            Submit Update
          </NavLink>
        ) : null}
      </nav>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-sm text-slate-300">Signed in as</p>
        <p className="mt-1 font-medium text-white">{user?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
