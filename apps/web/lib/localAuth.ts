export const DEMO_EMAIL = "demo@axiom.app";
export const DEMO_PASSWORD = "axiom123";

const KEY = "axiom_session_v1";

export type AxiomSession = {
  email: string;
  createdAt: string;
};

export function getSession(): AxiomSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AxiomSession;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): { ok: boolean; error?: string } {
  if (email.trim().toLowerCase() !== DEMO_EMAIL) return { ok: false, error: "Invalid email" };
  if (password !== DEMO_PASSWORD) return { ok: false, error: "Invalid password" };

  const session: AxiomSession = { email: DEMO_EMAIL, createdAt: new Date().toISOString() };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  return { ok: true };
}

export function signOut() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function initials(email?: string | null) {
  if (!email) return "U";
  const name = email.split("@")[0] ?? "U";
  const parts = name.split(/[._-]+/).filter(Boolean);
  const a = (parts[0]?.[0] ?? name[0] ?? "U").toUpperCase();
  const b = (parts[1]?.[0] ?? "").toUpperCase();
  return (a + b).slice(0, 2);
}