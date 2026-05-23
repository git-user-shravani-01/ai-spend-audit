"use client";

import { useEffect, useState } from "react";

type ToolData = {
  tool: string;
  plan: string;
  spend: string;
  seats: string;
  useCase: string;
};

export default function AuditForm() {
  const [formData, setFormData] = useState<ToolData>({
    tool: "",
    plan: "",
    spend: "",
    seats: "",
    useCase: "",
  });

  const [tools, setTools] = useState<ToolData[]>([]);

  const [error, setError] = useState("");

  const [result, setResult] = useState({
    savings: 0,
    yearlySavings: 0,
    recommendation: "",
    status: "",
  });

  useEffect(() => {
    const savedForm = localStorage.getItem("audit-form");
    const savedTools = localStorage.getItem("audit-tools");

    if (savedForm) {
      setFormData(JSON.parse(savedForm));
    }

    if (savedTools) {
      setTools(JSON.parse(savedTools));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("audit-form", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("audit-tools", JSON.stringify(tools));
  }, [tools]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const addTool = () => {
    if (!formData.tool || !formData.spend) {
      setError("Please select a tool and monthly spend.");

      return;
    }

    const duplicate = tools.find((item) => item.tool === formData.tool);

    if (duplicate) {
      setError("This tool has already been added.");

      return;
    }

    setTools([...tools, formData]);

    setFormData({
      tool: "",
      plan: "",
      spend: "",
      seats: "",
      useCase: "",
    });

    setError("");
  };

  const calculateSavings = () => {
    const allTools = [...tools];

    if (formData.tool && formData.spend) {
      allTools.push(formData);
    }

    if (allTools.length === 0) {
      setError("Add at least one AI tool before generating an audit.");

      return;
    }

    let totalSavings = 0;

    let recommendations: string[] = [];

    allTools.forEach((item) => {
      const spend = Number(item.spend);

      const seats = Number(item.seats);

      if (item.tool === "chatgpt" && seats <= 2 && spend > 60) {
        totalSavings += spend - 40;

        recommendations.push(
          "ChatGPT Team may be unnecessary for smaller teams.",
        );
      } else if (item.tool === "cursor" && seats <= 3 && spend > 60) {
        totalSavings += spend - 20;

        recommendations.push(
          "Cursor Pro could reduce engineering tooling costs.",
        );
      } else if (item.tool === "claude" && spend > 100) {
        totalSavings += spend * 0.2;

        recommendations.push(
          "Claude spend may be optimized through credits or usage allocation.",
        );
      }
    });

    if (recommendations.length === 0) {
      recommendations.push(
        "Your current AI spending appears relatively optimized.",
      );
    }

    setResult({
      savings: Math.round(totalSavings),
      yearlySavings: Math.round(totalSavings * 12),
      recommendation: recommendations.join(" "),
      status: totalSavings > 100 ? "high" : "optimized",
    });

    setError("");
  };

  const resetAudit = () => {
    setTools([]);

    setResult({
      savings: 0,
      yearlySavings: 0,
      recommendation: "",
      status: "",
    });

    localStorage.removeItem("audit-tools");
  };

  return (
    <div className="mt-20 w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8">
      <h2 className="text-3xl font-bold">Start Your Free AI Spend Audit</h2>

      <p className="mt-3 text-zinc-400">
        Analyze your AI tooling costs and uncover hidden savings.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

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
        onClick={addTool}
        className="mt-8 w-full rounded-xl border border-zinc-700 px-6 py-4 font-semibold transition hover:bg-zinc-800"
      >
        Add Another Tool
      </button>

      <button
        onClick={calculateSavings}
        className="mt-4 w-full rounded-xl bg-white px-6 py-4 font-semibold text-black transition hover:scale-[1.01]"
      >
        Generate Audit Report
      </button>

      {tools.length > 0 && (
        <button
          onClick={resetAudit}
          className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-4 font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          Reset Audit
        </button>
      )}

      {tools.length > 0 && (
        <div className="mt-10 rounded-2xl border border-zinc-800 bg-black/30 p-6">
          <h3 className="text-xl font-bold">Added AI Tools</h3>

          <div className="mt-6 space-y-4">
            {tools.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-zinc-700 p-4"
              >
                <div>
                  <p className="font-semibold capitalize">{item.tool}</p>

                  <p className="text-sm text-zinc-400">
                    {item.plan || "No plan selected"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">${item.spend}</p>

                  <p className="text-sm text-zinc-400">
                    {item.seats || 1} seats
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.recommendation && (
        <div className="mt-10 rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-left">
          <h3 className="text-2xl font-bold text-green-400">
            Estimated Savings
          </h3>

          <p className="mt-4 text-5xl font-bold">
            ${result.savings}
            <span className="text-lg text-zinc-400"> / month</span>
          </p>

          <p className="mt-2 text-zinc-400">
            Approx. ${result.yearlySavings.toLocaleString()} yearly savings
            opportunity.
          </p>

          <div className="mt-6 rounded-xl border border-zinc-700 bg-black/40 p-4">
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Recommendation
            </p>

            <p className="mt-2 text-zinc-200">{result.recommendation}</p>
          </div>

          {result.status === "high" && (
            <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="text-sm font-semibold text-yellow-300">
                High Savings Opportunity Detected
              </p>

              <p className="mt-2 text-sm text-zinc-300">
                Teams with significant AI spend often reduce costs further using
                infrastructure credits and vendor optimization through Credex.
              </p>

              <button className="mt-4 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black">
                Book Credex Consultation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
