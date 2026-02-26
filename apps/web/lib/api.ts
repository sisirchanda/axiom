export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
};

export type AuthResponse = {
  user: User;
  token: string;
};

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

async function jsonFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  signup: (email: string, password: string, name?: string) =>
    jsonFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    jsonFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  google: (email?: string, name?: string) =>
    jsonFetch<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    }),

  me: (token: string) =>
    jsonFetch<{ user: User; token: string }>("/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),
};