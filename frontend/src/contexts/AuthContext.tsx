import { createContext, PropsWithChildren, useEffect, useState } from "react";

import { getCurrentUser, loginUser, registerUser, RegisterPayload } from "../api/auth";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "smartseason-auth";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(stored) as { token: string; user: User };
    setToken(parsed.token);
    getCurrentUser(parsed.token)
      .then((freshUser) => {
        setUser(freshUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: parsed.token, user: freshUser }));
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = (nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  };

  const login = async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    persist(response.access, response.user);
  };

  const register = async (payload: RegisterPayload) => {
    await registerUser(payload);
    await login(payload.email, payload.password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
