import { LoginResponse, User, UserRole } from "../types";
import { apiRequest } from "./client";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export function registerUser(payload: RegisterPayload) {
  return apiRequest<User>("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: LoginPayload) {
  return apiRequest<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(token: string) {
  return apiRequest<User>("/auth/me/", { token });
}

export function fetchAgents(token: string) {
  return apiRequest<User[]>("/auth/agents/", { token });
}
