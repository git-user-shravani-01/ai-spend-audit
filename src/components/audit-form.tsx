"use client";

import { useEffect, useState } from "react";

export default function AuditForm() {
  const [formData, setFormData] = useState({
    tool: "",
    plan: "",
    spend: "",
    seats: "",
    useCase: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("audit-form");

    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("audit-form", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateSavings = () => {
    const spend = Number(formData.spend);
    const seats = Number(formData.seats);

    let savings = 0;
    let recommendation = "";

    if (formData.tool === "chatgpt" && seats <= 2 && spend > 60) {
      savings = spend - 40;
      recommendation =
        "You may be overspending on ChatGPT Team. ChatGPT Plus may fit your team better.";
    }

    if (formData.tool === "cursor" && seats <= 3 && spend > 60) {
      savings = spend - 20;
      recommendation =
        "Cursor Pro may provide similar functionality at lower cost.";
    }

    if (formData.tool === "claude" && spend > 100) {
      savings = spend * 0.2;
      recommendation =
        "You may reduce costs through optimized Claude usage or credits.";
    }

    alert(
      `Estimated Monthly Savings: $${Math.round(savings)}\n\n${recommendation}`,
    );
  };

  return (
    <div className="mt-20 w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8">
      <h2 className="text-3xl font-bold">Start Your Free AI Spend Audit</h2>

      <p className="mt-3 text-zinc-400">
        Analyze your AI tooling costs and uncover hidden savings.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">AI Tool</label>

          <select
            name="tool"
            value={formData.tool}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none"
          >
            <option value="">Select Tool</option>
            <option value="chatgpt">ChatGPT</option>
            <option value="claude">Claude</option>
            <option value="cursor">Cursor</option>
            <option value="copilot">GitHub Copilot</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Current Plan
          </label>

          <input
            type="text"
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            placeholder="Pro / Team / Enterprise"
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Monthly Spend ($)
          </label>

          <input
            type="number"
            name="spend"
            value={formData.spend}
            onChange={handleChange}
            placeholder="500"
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Number of Seats
          </label>

          <input
            type="number"
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            placeholder="10"
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-400">
            Primary Use Case
          </label>

          <select
            name="useCase"
            value={formData.useCase}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none"
          >
            <option value="">Select Use Case</option>
            <option value="coding">Coding</option>
            <option value="writing">Writing</option>
            <option value="research">Research</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculateSavings}
        className="mt-10 w-full rounded-xl bg-white px-6 py-4 font-semibold text-black transition hover:scale-[1.01]"
      >
        Generate Audit Report
      </button>
    </div>
  );
}
