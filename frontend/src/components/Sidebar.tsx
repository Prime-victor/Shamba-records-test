import { NavLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const desktopNavBase =
  "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition";
const mobileNavBase =
  "flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-3 py-2 text-[11px] font-medium transition";

export function Sidebar() {
  const { user, logout } = useAuth();
  const navItems = [
    { to: "/dashboard", label: "Dashboard", shortLabel: "Home", icon: "◫" },
    { to: "/fields", label: "Fields", shortLabel: "Fields", icon: "▦" },
    ...(user?.role === "agent"
      ? [{ to: "/updates/new", label: "Submit Update", shortLabel: "Update", icon: "✎" }]
      : []),
  ];

  return (
    <>
      <aside className="w-full bg-sidebar text-sidebar-text md:flex md:min-h-screen md:w-72 md:flex-col md:px-5 md:py-8">
        <div className="border-b border-slate-800 px-4 py-4 md:mb-10 md:border-b-0 md:px-0 md:py-0">
          <div className="flex items-center justify-between gap-4 md:block">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-secondary-light md:text-xs">Field Intelligence</p>
              <h2 className="mt-1 text-xl font-semibold text-white md:mt-3 md:text-2xl">SmartSeason</h2>
            </div>
            <div className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 md:hidden">
              {user?.role === "admin" ? "Admin" : "Agent"}
            </div>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-400 md:mt-2">
            Monitor field health, agent activity, and crop progress in one view.
          </p>
        </div>

        <div className="hidden px-4 py-4 md:flex md:flex-1 md:flex-col md:px-0 md:py-0">
          <nav className="md:flex md:flex-1 md:flex-col md:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${desktopNavBase} ${isActive ? "bg-primary text-white" : "hover:bg-slate-800"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-300">Signed in as</p>
            <p className="mt-1 break-all font-medium text-white">{user?.email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-sidebar/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2 rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-2 shadow-soft">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${mobileNavBase} ${isActive ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-900"}`
              }
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="mt-1 truncate">{item.shortLabel}</span>
            </NavLink>
          ))}
          <button
            type="button"
            onClick={logout}
            className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-3 py-2 text-[11px] font-medium text-slate-300 transition hover:bg-slate-900"
          >
            <span className="text-base leading-none">↗</span>
            <span className="mt-1 truncate">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
