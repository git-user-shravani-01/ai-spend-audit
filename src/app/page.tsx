import AuditForm from "@/components/audit-form";
import Navbar from "@/components/navbar";
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="max-w-5xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-500">
            Credex AI Spend Audit
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Stop Overpaying
            <br />
            For AI Tools
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Audit your ChatGPT, Claude, Cursor and AI infrastructure spending in
            minutes. Discover hidden savings instantly.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105">
              Start Free Audit
            </button>

            <button className="rounded-xl border border-zinc-700 px-6 py-3 text-white transition hover:bg-zinc-900">
              View Sample Report
            </button>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="text-3xl font-bold">$12k+</h3>

              <p className="mt-2 text-zinc-400">
                Average yearly savings discovered
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="text-3xl font-bold">2 Minutes</h3>

              <p className="mt-2 text-zinc-400">
                To complete a full AI spend audit
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="text-3xl font-bold">100%</h3>

              <p className="mt-2 text-zinc-400">
                Free with actionable recommendations
              </p>
            </div>
          </div>
          <section className="mx-auto mt-24 max-w-5xl text-center">
            <h1 className="text-6xl font-black leading-tight">
              Cut Your AI Costs
              <span className="text-green-400"> Instantly</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Analyze ChatGPT, Claude, Gemini, Copilot and Cursor spending with
              intelligent AI-powered recommendations.
            </p>
          </section>
          <AuditForm />
        </div>
      </section>
    </main>
  );
}
