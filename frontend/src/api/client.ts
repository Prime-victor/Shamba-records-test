const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = envApiUrl
  ? envApiUrl.replace(/\/+$/, "")
  : import.meta.env.DEV
    ? "http://127.0.0.1:8000/api"
    : "";

if (!API_URL) {
  throw new Error("VITE_API_URL is required for production builds.");
}

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  headers.set("Content-Type", "application/json");
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload.detail || payload.email?.[0] || payload.password?.[0] || "Request failed";
    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
