"use client";

import { useState } from "react";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="bg-[#B8934A] text-white px-4 py-2 rounded-sm text-sm font-sans"
    >
      {loading ? "Redirecting…" : "Upgrade to Pro"}
    </button>
  );
}