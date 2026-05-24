"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

type ToolData = {
  tool: string;
  plan: string;
  spend: string;
  seats: string;
  useCase: string;
};

type AuditBreakdown = {
  tool: string;
  currentSpend: number;
  savings: number;
  yearlySavings: number;
  recommendation: string;
};

type HistoryItem = {
  id: number;
  tool: string;
  plan: string;
  spend: number;
  seats: number;
  use_case: string;
};

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7"];

export default function AuditForm() {
  const [formData, setFormData] = useState<ToolData>({
    tool: "",
    plan: "",
    spend: "",
    seats: "",
    useCase: "",
  });

  const [tools, setTools] = useState<ToolData[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const [auditBreakdown, setAuditBreakdown] = useState<AuditBreakdown[]>([]);

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

    fetchAuditHistory();
  }, []);

  useEffect(() => {
    localStorage.setItem("audit-form", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("audit-tools", JSON.stringify(tools));
  }, [tools]);

  const fetchAuditHistory = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("audit_reports")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setHistory(data as HistoryItem[]);
    }
  };

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

  const calculateSavings = async () => {
    setLoading(true);

    const allTools = [...tools];

    if (formData.tool && formData.spend) {
      allTools.push(formData);
    }

    if (allTools.length === 0) {
      setError("Add at least one AI tool before generating an audit.");
      setLoading(false);
      return;
    }

    let totalSavings = 0;

    let recommendations: string[] = [];

    let breakdown: AuditBreakdown[] = [];

    allTools.forEach((item) => {
      const spend = Number(item.spend);
      const seats = Number(item.seats);

      let savings = 0;
      let recommendation = "";

      if (item.tool === "chatgpt" && seats <= 2 && spend > 60) {
        savings = spend - 40;

        recommendation = "Downgrade from Team to Plus for smaller teams.";
      } else if (item.tool === "cursor" && seats <= 3 && spend > 60) {
        savings = spend - 20;

        recommendation =
          "Cursor Pro offers similar functionality at lower cost.";
      } else if (item.tool === "claude" && spend > 100) {
        savings = spend * 0.2;

        recommendation =
          "Infrastructure credits could reduce Claude costs significantly.";
      } else if (item.tool === "copilot" && seats <= 5) {
        savings = spend * 0.15;

        recommendation =
          "GitHub Copilot Business may be oversized for your current team.";
      } else if (item.tool === "gemini" && spend > 80) {
        savings = spend * 0.1;

        recommendation =
          "Gemini usage may be optimized through lower-cost plans.";
      } else {
        recommendation = "Your current setup appears relatively optimized.";
      }

      totalSavings += savings;

      recommendations.push(recommendation);

      breakdown.push({
        tool: item.tool,
        currentSpend: spend,
        savings: Math.round(savings),
        yearlySavings: Math.round(savings * 12),
        recommendation,
      });
    });

    setAuditBreakdown(breakdown);

    setResult({
      savings: Math.round(totalSavings),
      yearlySavings: Math.round(totalSavings * 12),
      recommendation: recommendations.join(" "),
      status: totalSavings > 100 ? "high" : "optimized",
    });

    try {
      if (supabase) {
        const { error } = await supabase.from("audit_reports").insert(
          allTools.map((item) => ({
            tool: item.tool,
            plan: item.plan,
            spend: Number(item.spend),
            seats: Number(item.seats),
            use_case: item.useCase,
          })),
        );

        if (error) {
          console.log(error);
        }

        await fetchAuditHistory();
      }

      const response = await fetch("/api/generate-summary", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          tools: allTools,
          savings: totalSavings,
        }),
      });

      const data = await response.json();

      setAiSummary(data.summary);
    } catch (error) {
      setAiSummary(
        "Your AI stack may contain optimization opportunities through smarter plan allocation and infrastructure credit usage.",
      );
    }

    setLoading(false);

    setError("");
  };

  const resetAudit = () => {
    setTools([]);

    setAuditBreakdown([]);

    setAiSummary("");

    setResult({
      savings: 0,
      yearlySavings: 0,
      recommendation: "",
      status: "",
    });

    localStorage.removeItem("audit-tools");
  };

  return (
    <div className="mt-20 w-full max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8">
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
        {loading ? "Generating AI Audit..." : "Generate Audit Report"}
      </button>

      {tools.length > 0 && (
        <button
          onClick={resetAudit}
          className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-4 font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          Reset Audit
        </button>
      )}

      {auditBreakdown.length > 0 && (
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6">
            <h3 className="mb-6 text-2xl font-bold">Spend Distribution</h3>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={auditBreakdown}
                    dataKey="currentSpend"
                    nameKey="tool"
                    outerRadius={100}
                    label
                  >
                    {auditBreakdown.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6">
            <h3 className="mb-6 text-2xl font-bold">Savings Comparison</h3>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={auditBreakdown}>
                  <XAxis dataKey="tool" stroke="#a1a1aa" />

                  <YAxis stroke="#a1a1aa" />

                  <Tooltip />

                  <Bar dataKey="savings" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10 rounded-2xl border border-zinc-800 bg-black/30 p-6">
          <h3 className="text-2xl font-bold">Recent Audit History</h3>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-700 text-zinc-400">
                  <th className="pb-4">Tool</th>
                  <th className="pb-4">Plan</th>
                  <th className="pb-4">Spend</th>
                  <th className="pb-4">Seats</th>
                  <th className="pb-4">Use Case</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-800">
                    <td className="py-4 capitalize">{item.tool}</td>

                    <td>{item.plan}</td>

                    <td>${item.spend}</td>

                    <td>{item.seats}</td>

                    <td className="capitalize">{item.use_case}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aiSummary && (
        <div className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
          <p className="text-sm uppercase tracking-widest text-blue-300">
            AI Generated Executive Summary
          </p>

          <p className="mt-4 leading-8 text-zinc-200">{aiSummary}</p>
        </div>
      )}

      {result.recommendation && (
        <div className="mt-10 rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
          <h3 className="text-3xl font-bold text-green-400">
            Total Estimated Savings
          </h3>

          <p className="mt-4 text-5xl font-bold">
            ${result.savings}
            <span className="text-lg text-zinc-400"> / month</span>
          </p>

          <p className="mt-2 text-zinc-300">
            Approx. ${result.yearlySavings.toLocaleString()} yearly savings
            opportunity.
          </p>
        </div>
      )}
    </div>
  );
}
