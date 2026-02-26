"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/session";

type RequestRow = {
  id: string; // hidden column
  name: string;
  module: string;
  configFileName: string;
  configFileUrl: string;
  status: "Queued" | "Running" | "Success" | "Failed";
  output: string;
};

const DEMO_ROWS: RequestRow[] = [
  {
    id: "REQ-0001",
    name: "GL Setup - COA + Ledger",
    module: "Oracle Fusion - General Ledger",
    configFileName: "gl_setup_v1.xlsx",
    configFileUrl: "#",
    status: "Success",
    output: "Ledger created. COA segments validated.",
  },
  {
    id: "REQ-0002",
    name: "Procurement Supplier Import",
    module: "Oracle Fusion - Procurement",
    configFileName: "suppliers_import.xlsx",
    configFileUrl: "#",
    status: "Running",
    output: "Executing step 14/42...",
  },
  {
    id: "REQ-0003",
    name: "HR Org Structure Setup",
    module: "Oracle Fusion - HCM",
    configFileName: "hr_org_setup.xlsx",
    configFileUrl: "#",
    status: "Failed",
    output: "Step 7 failed: element not found (retry limit reached).",
  },
];

function statusPill(status: RequestRow["status"]) {
  const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border";
  switch (status) {
    case "Success":
      return `${base} bg-green-50 text-green-700 border-green-100`;
    case "Failed":
      return `${base} bg-red-50 text-red-700 border-red-100`;
    case "Running":
      return `${base} bg-blue-50 text-blue-700 border-blue-100`;
    default:
      return `${base} bg-gray-100 text-gray-700 border-gray-200`;
  }
}

export default function DashboardPage() {
  const router = useRouter();

  // Auth guard (placeholder: checks session token)
  useEffect(() => {
    const s = getSession();
    if (!s?.token) router.replace("/auth?next=/dashboard");
  }, [router]);

  // Search filters
  const [q, setQ] = useState("");
  const [module, setModule] = useState("All");
  const [status, setStatus] = useState("All");

  const [rows, setRows] = useState<RequestRow[]>(DEMO_ROWS);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesQ =
        !q.trim() ||
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.module.toLowerCase().includes(q.toLowerCase()) ||
        r.configFileName.toLowerCase().includes(q.toLowerCase());

      const matchesModule = module === "All" || r.module === module;
      const matchesStatus = status === "All" || r.status === status;

      return matchesQ && matchesModule && matchesStatus;
    });
  }, [rows, q, module, status]);

  const onSearch = () => {
    // Placeholder: later call backend search API with q/module/status
    // For now filtering is local, so just no-op.
  };

  const onCreateNew = () => {
    // Placeholder: later go to create request page (upload excel)
    router.push("/requests/new");
  };

  const uniqueModules = useMemo(() => {
    const s = new Set(rows.map((r) => r.module));
    return ["All", ...Array.from(s)];
  }, [rows]);

  return (
    <div className="min-h-screen bg-white">
      {/* Same navbar */}
      <Navbar />

      <main className="mx-auto max-w-6xl px-8 py-8 space-y-8">
        {/* ================= 1) SEARCH SECTION ================= */}
        <section className="rounded-2xl border shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Requests</h1>
              <p className="text-sm text-gray-600 mt-1">
                Search earlier submitted configuration requests.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onSearch}
                className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-gray-50"
              >
                Search
              </button>
              <button
                onClick={onCreateNew}
                className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90"
              >
                Create New
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-700">Search</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by request name, module, file..."
                className="mt-1 w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Module</label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
              >
                {uniqueModules.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
              >
                {["All", "Queued", "Running", "Success", "Failed"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ================= 2) RESULTS TABLE ================= */}
        <section className="rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="font-semibold text-gray-900">Search Results</div>
            <div className="text-sm text-gray-600">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  {/* Request ID hidden column (kept in data only) */}
                  <th className="px-5 py-3 text-left font-medium">Request Name</th>
                  <th className="px-5 py-3 text-left font-medium">Module</th>
                  <th className="px-5 py-3 text-left font-medium">Config File</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Output</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{r.name}</div>
                      {/* Hidden Request ID but still available if you need later */}
                      <div className="text-xs text-gray-500 hidden">ID: {r.id}</div>
                    </td>

                    <td className="px-5 py-3 text-gray-700">{r.module}</td>

                    <td className="px-5 py-3">
                      <a
                        href={r.configFileUrl}
                        className="text-blue-700 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {r.configFileName}
                      </a>
                    </td>

                    <td className="px-5 py-3">
                      <span className={statusPill(r.status)}>{r.status}</span>
                    </td>

                    <td className="px-5 py-3 text-gray-700">{r.output}</td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-gray-600" colSpan={5}>
                      No results found. Try a different search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}