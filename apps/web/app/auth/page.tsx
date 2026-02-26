"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { setSession } from "@/lib/session";

export default function AuthPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextPath = sp.get("next") || "/dashboard";

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");      // user types any email
  const [password, setPassword] = useState(""); // user types any password
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (tab === "signin" ? "Sign in to Axiom" : "Create your Axiom account"), [tab]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "signin") {
        const res = await api.login(email, password); // ✅ backend call
        setSession({ token: res.token, user: res.user, createdAt: new Date().toISOString() });
        router.push(nextPath);
      } else {
        // Signup exists but backend returns "not enabled yet" for now
        await api.signup(email, password, name);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await api.google(); // backend placeholder => "coming soon"
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left side: brand + message */}
          <div className="lg:pt-10">
            <div className="flex items-center gap-2">
              <div className="h-11 w-11 rounded-2xl bg-black text-white flex items-center justify-center font-semibold">
                A
              </div>
              <div>
                <div className="text-xl font-semibold">Axiom</div>
                <div className="text-sm text-gray-500">ERP Configuration Automation</div>
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-3 text-gray-600 max-w-md">
              Automate repetitive ERP configuration and standardize deployments across environments.
              Start with Oracle Fusion today.
            </p>

            <div className="mt-6 rounded-2xl border p-4 max-w-md">
              <div className="font-medium text-gray-900">Demo access (temporary)</div>
              <div className="text-sm text-gray-600 mt-1">
                Use: <span className="font-medium">demo@demo.com</span> /{" "}
                <span className="font-medium">demo123</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                This page behaves like production: it calls the backend and stores an auth token.
              </div>
            </div>
          </div>

          {/* Right side: auth card */}
          <div className="rounded-3xl border shadow-sm p-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setTab("signin")}
                className={`flex-1 rounded-2xl py-2.5 text-sm font-medium border ${
                  tab === "signin" ? "bg-black text-white border-black" : "bg-white"
                }`}
              >
                Signin
              </button>
              <button
                onClick={() => setTab("signup")}
                className={`flex-1 rounded-2xl py-2.5 text-sm font-medium border ${
                  tab === "signup" ? "bg-black text-white border-black" : "bg-white"
                }`}
              >
                Signup
              </button>
            </div>

            <button
              onClick={onGoogle}
              disabled={loading || googleLoading}
              className="w-full rounded-2xl border py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <div className="text-xs text-gray-500">or</div>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {tab === "signup" && (
                <div>
                  <label className="text-sm text-gray-700">Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-2xl border px-3 py-2.5"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-2xl border px-3 py-2.5"
                  placeholder="you@company.com"
                  type="email"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-2xl border px-3 py-2.5"
                  placeholder="••••••••"
                  type="password"
                />
              </div>

              {error && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl p-3">
                  {error}
                </div>
              )}

              <button
                disabled={loading || googleLoading}
                className="w-full rounded-2xl bg-black text-white py-3 text-sm font-medium disabled:opacity-60"
              >
                {loading ? (tab === "signin" ? "Signing in..." : "Creating account...") : tab === "signin" ? "Sign in" : "Create account"}
              </button>

              {tab === "signup" && (
                <div className="text-xs text-gray-500">
                  Signup backend is coming later. For now, use demo credentials to sign in.
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <button className="text-sm text-gray-600 underline" onClick={() => router.push("/")}>
                Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}