"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSession, initials } from "@/lib/session";

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    setEmail(s?.user?.email ?? null);
    setName(s?.user?.name ?? null);
  }, []);

  const handleGetStarted = () => {
    const s = getSession();
    if (!s?.token) router.push("/auth?next=/dashboard");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ================= NAVBAR ================= */}
      <div className="flex justify-between items-center px-8 py-4 border-b">
        {/* Left Icon */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
            A
          </div>
          <div className="font-semibold text-lg">Axiom</div>
        </div>

        {/* Right Buttons / Avatar */}
        <div className="flex items-center gap-3">
          {!email ? (
            <>
              <button onClick={() => router.push("/auth")} className="px-4 py-2 border rounded-xl">
                Signin
              </button>
              <button onClick={() => router.push("/auth")} className="px-4 py-2 bg-black text-white rounded-xl">
                Signup
              </button>
            </>
          ) : (
            <>
              <div className="hidden sm:block text-sm text-gray-600">
                {name ? `${name} • ${email}` : email}
              </div>
              <div className="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                {initials(name || email)}
              </div>
              <button
                onClick={() => {
                  clearSession();
                  setEmail(null);
                  setName(null);
                  router.push("/");
                }}
                className="px-4 py-2 border rounded-xl"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="text-center py-14 px-6">
        <h1 className="text-4xl font-bold">Automate ERP Configuration. Deploy Faster.</h1>

        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Axiom transforms repetitive ERP configuration into automated execution workflows.
          Start with Oracle Fusion today.
        </p>
      </div>

      {/* ================= ERP CARDS ================= */}
      <div className="grid md:grid-cols-3 gap-6 px-10 pb-16">
        {/* -------- ORACLE FUSION -------- */}
        <div className="border rounded-2xl overflow-hidden shadow-sm">
          <div className="h-48 relative">
            <Image src="/erp/oracle-fusion.png" alt="Oracle Fusion" fill className="object-contain p-6" />
          </div>

          <div className="p-5">
            <h2 className="text-xl font-semibold">Oracle Fusion</h2>

            <p className="text-gray-600 text-sm mt-2">
              Upload configuration files and let Axiom automate Oracle Fusion setup.
              Reduce manual effort and accelerate implementation.
            </p>

            <button onClick={handleGetStarted} className="mt-4 w-full bg-black text-white py-2 rounded-xl">
              Get Started
            </button>
          </div>
        </div>

        {/* -------- SAP -------- */}
        <div className="border rounded-2xl overflow-hidden shadow-sm">
          <div className="h-48 relative">
            <Image src="/erp/sap.png" alt="SAP" fill className="object-contain p-6" />
          </div>

          <div className="p-5">
            <h2 className="text-xl font-semibold">SAP</h2>
            <p className="text-gray-600 text-sm mt-2">
              Enterprise-grade SAP automation is on the way. Configure SAP environments through guided workflows.
            </p>
            <div className="mt-4 w-full border py-2 rounded-xl text-center text-gray-500">Coming Soon</div>
          </div>
        </div>

        {/* -------- MICROSOFT DYNAMICS -------- */}
        <div className="border rounded-2xl overflow-hidden shadow-sm">
          <div className="h-48 relative">
            <Image src="/erp/dynamics.png" alt="Dynamics" fill className="object-contain p-6" />
          </div>

          <div className="p-5">
            <h2 className="text-xl font-semibold">Microsoft Dynamics</h2>
            <p className="text-gray-600 text-sm mt-2">
              Standardize Dynamics deployments with automated configuration execution.
            </p>
            <div className="mt-4 w-full border py-2 rounded-xl text-center text-gray-500">Coming Soon</div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="border-t text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Axiom
      </div>
    </div>
  );
}