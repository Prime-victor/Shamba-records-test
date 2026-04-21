import { DashboardSummary, Field, FieldStage, FieldUpdate } from "../types";
import { apiRequest } from "./client";

export interface FieldPayload {
  name: string;
  crop_type: string;
  planting_date: string;
  stage: FieldStage;
  assigned_agent_id?: number | null;
}

export function fetchFields(token: string) {
  return apiRequest<Field[]>("/fields/", { token });
}

export function fetchField(token: string, id: string) {
  return apiRequest<Field>(`/fields/${id}/`, { token });
}

export function createField(token: string, payload: FieldPayload) {
  return apiRequest<Field>("/fields/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateField(token: string, id: string, payload: Partial<FieldPayload>) {
  return apiRequest<Field>(`/fields/${id}/`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function assignField(token: string, id: number, assigned_agent_id: number | null) {
  return apiRequest<Field>(`/fields/${id}/assign/`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ assigned_agent_id }),
  });
}

export function submitFieldUpdate(token: string, id: string, payload: { stage: FieldStage; notes: string }) {
  return apiRequest<FieldUpdate>(`/fields/${id}/update/`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function fetchFieldUpdates(token: string, id: string) {
  return apiRequest<FieldUpdate[]>(`/fields/${id}/updates/`, { token });
}

export function fetchAdminDashboard(token: string) {
  return apiRequest<DashboardSummary>("/dashboard/admin/", { token });
}

export function fetchAgentDashboard(token: string) {
  return apiRequest<DashboardSummary>("/dashboard/agent/", { token });
}
