import { Outlet } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 bg-field-grid bg-[size:22px_22px] px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-8">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}
