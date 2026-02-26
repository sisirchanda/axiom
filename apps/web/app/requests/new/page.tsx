"use client";

import Navbar from "@/components/Navbar";

export default function NewRequestPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-8 py-8">
        <h1 className="text-2xl font-semibold">Create New Request</h1>
        <p className="mt-2 text-gray-600">
          Placeholder page. Next we’ll add Excel upload + module selection + submit.
        </p>
      </main>
    </div>
  );
}