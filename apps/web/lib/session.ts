import type { User } from "@/lib/api";

const KEY = "axiom_session_v1";

export type Session = {
  token: string;
  user: User;
  createdAt: string;
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function setSession(session: Session) {
  window.localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(KEY);
}

export function initials(nameOrEmail?: string | null) {
  if (!nameOrEmail) return "U";
  const s = nameOrEmail.trim();
  const base = s.includes("@") ? s.split("@")[0] : s;
  const parts = base.split(/[ ._-]+/).filter(Boolean);
  const a = (parts[0]?.[0] ?? "U").toUpperCase();
  const b = (parts[1]?.[0] ?? "").toUpperCase();
  return (a + b).slice(0, 2);
}