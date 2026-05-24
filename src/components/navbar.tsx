export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-black tracking-tight text-white">
          AI Spend Audit
        </h1>

        <button className="rounded-xl bg-white px-5 py-2 font-semibold text-black transition hover:scale-105">
          Get Started
        </button>
      </div>
    </nav>
  );
}
