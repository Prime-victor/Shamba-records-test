export type UserRole = "admin" | "agent";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface FieldUpdate {
  id: number;
  field: number;
  agent: User;
  stage: FieldStage;
  notes: string;
  created_at: string;
}

export type FieldStage = "Planted" | "Growing" | "Ready" | "Harvested";
export type FieldStatus = "Active" | "At Risk" | "Completed";

export interface Field {
  id: number;
  name: string;
  crop_type: string;
  planting_date: string;
  stage: FieldStage;
  assigned_agent: User | null;
  status: FieldStatus;
  latest_update: FieldUpdate | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_fields?: number;
  assigned_fields?: number;
  active_fields: number;
  at_risk_fields: number;
  completed_fields: number;
  stage_breakdown: Record<string, number>;
  recent_fields: Array<{
    id: number;
    name: string;
    crop_type: string;
    stage: FieldStage;
    status: FieldStatus;
    assigned_agent: string | null;
  }>;
  recent_updates?: Array<{
    field: string;
    stage: FieldStage;
    created_at: string;
    notes: string;
  }>;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}
