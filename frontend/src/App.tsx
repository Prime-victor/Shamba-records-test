import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { FieldDetailsPage } from "./pages/FieldDetailsPage";
import { FieldsListPage } from "./pages/FieldsListPage";
import { LoginPage } from "./pages/LoginPage";
import { UpdateFormPage } from "./pages/UpdateFormPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/fields" element={<FieldsListPage />} />
          <Route path="/fields/:id" element={<FieldDetailsPage />} />
          <Route path="/updates/new" element={<UpdateFormPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
