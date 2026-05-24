export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-zinc-800 px-8 py-5">
      <h1 className="text-2xl font-bold text-white">AI Spend Audit</h1>

      <button className="rounded-xl bg-white px-5 py-2 font-semibold text-black transition hover:scale-105">
        Get Started
      </button>
    </nav>
  );
}
