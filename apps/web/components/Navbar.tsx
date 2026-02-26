"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession, initials } from "@/lib/session";

export default function Navbar() {
  const router = useRouter();
  const [display, setDisplay] = useState<{ email: string; name?: string | null } | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.token) {
      setDisplay(null);
      return;
    }
    setDisplay({ email: s.user.email, name: s.user.name });
  }, []);

  const onLogout = () => {
    clearSession();
    setDisplay(null);
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 border-b bg-white">
      {/* Left: Icon + name */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
        <div className="bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
          A
        </div>
        <div className="font-semibold text-lg">Axiom</div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {!display ? (
          <>
            <button
              onClick={() => router.push("/auth?next=/dashboard")}
              className="px-4 py-2 border rounded-xl"
            >
              Signin
            </button>
            <button
              onClick={() => router.push("/auth?next=/dashboard")}
              className="px-4 py-2 bg-black text-white rounded-xl"
            >
              Signup
            </button>
          </>
        ) : (
          <>
            <div className="hidden sm:block text-sm text-gray-600">
              {display.name ? `${display.name} • ${display.email}` : display.email}
            </div>
            <div className="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
              {initials(display.name || display.email)}
            </div>
            <button onClick={onLogout} className="px-4 py-2 border rounded-xl">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}