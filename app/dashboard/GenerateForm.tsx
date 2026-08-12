"use client";

import { useState } from "react";

export default function GenerateForm() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setIsLoading(true);
    setResult("");
    setError("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, features }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Something went wrong.");
        return;
      }

      if (!res.body) {
        setError("Something went wrong.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setResult((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
      <div className="bg-white rounded-md border border-[#E3E1D9] p-6 flex flex-col h-[420px]">
        <label className="text-xs uppercase tracking-widest text-[#6B6963] mb-2 font-sans">
          Product name
        </label>
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Wireless Noise-Cancelling Headphones"
          className="border border-[#E3E1D9] rounded-sm px-3 py-2 mb-4 text-sm font-sans text-[#1C1E1B] placeholder:text-[#A8A6A0] focus:outline-none shrink-0"
        />
        <label className="text-xs uppercase tracking-widest text-[#6B6963] mb-2 font-sans">
          Key features
        </label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="40-hour battery, active noise cancellation, foldable design"
          className="flex-1 border border-[#E3E1D9] rounded-sm px-3 py-2 text-sm font-sans text-[#1C1E1B] placeholder:text-[#A8A6A0] focus:outline-none resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || productName.trim() === ""}
          className="mt-4 bg-[#0F5C4F] text-white py-2.5 rounded-sm text-sm font-sans cursor-pointer disabled:bg-[#D9D7D0] disabled:text-[#A8A6A0] disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? "Generating…" : "Generate Listing"}
        </button>
        {error && (
          <div className="mt-3 text-sm text-[#8A342D] font-sans shrink-0">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white rounded-md border border-[#E3E1D9] p-6 h-[420px] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          {result ? (
            <div className="whitespace-pre-wrap text-sm font-sans text-[#1C1E1B]">
              {result}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm font-sans text-[#8A887E] text-center">
              {isLoading ? "Generating your listing…" : "Your listing will appear here."}
            </div>
          )}
        </div>
        {result && !isLoading && (
          <div className="pt-4 mt-2 border-t border-[#E3E1D9] shrink-0">
            <button
              onClick={handleCopy}
              className="text-sm font-sans text-[#0F5C4F] hover:text-[#0C4B41] cursor-pointer"
            >
              {copied ? "Copied ✓" : "Copy to clipboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}