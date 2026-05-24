import AuditForm from "@/components/audit-form";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <div className="rounded-full border border-green-500/20 bg-green-500/10 px-6 py-2 text-sm text-green-300">
          AI Cost Optimization Platform
        </div>

        <h1 className="mt-8 text-6xl font-black leading-tight tracking-tight md:text-7xl">
          Reduce Your
          <span className="text-green-400"> AI Spending </span>
          Instantly
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Analyze ChatGPT, Claude, Gemini, GitHub Copilot and Cursor costs with
          intelligent AI-powered recommendations and advanced savings insights.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4">
            <p className="text-3xl font-black text-green-400">$12K+</p>
            <p className="mt-1 text-sm text-zinc-400">Average Yearly Savings</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4">
            <p className="text-3xl font-black text-blue-400">500+</p>
            <p className="mt-1 text-sm text-zinc-400">AI Audits Generated</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4">
            <p className="text-3xl font-black text-purple-400">5 Tools</p>
            <p className="mt-1 text-sm text-zinc-400">Supported Platforms</p>
          </div>
        </div>

        <AuditForm />
      </section>
    </main>
  );
}
