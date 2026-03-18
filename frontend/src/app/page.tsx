export default function Home() {
  return (
    <div className="flex flex-col gap-16 px-8 py-20 max-w-5xl mx-auto">
      {/* Hero / Gradient text */}
      <section className="text-center">
        <h1 className="gradient-text text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
          Empowering Dreams. Engineering Reality.
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Zyphr — Design system preview. This page validates brand colors, typography, gradients,
          and glassmorphism.
        </p>
      </section>

      {/* Color Swatches */}
      <section>
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-6">
          Brand Colors
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-xl bg-purple" />
            <span className="text-sm text-text-secondary">Purple</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-xl bg-ceylon-blue" />
            <span className="text-sm text-text-secondary">Ceylon Blue</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-xl bg-champagne" />
            <span className="text-sm text-text-secondary">Champagne</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-xl bg-charcoal" />
            <span className="text-sm text-text-secondary">Charcoal</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-xl bg-near-black border border-border" />
            <span className="text-sm text-text-secondary">Near Black</span>
          </div>
        </div>
      </section>

      {/* Gradient Backgrounds */}
      <section>
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-6">
          Gradients
        </h2>
        <div className="flex flex-col gap-4">
          <div className="gradient-brand h-24 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold">gradient-brand</span>
          </div>
          <div className="gradient-brand-diagonal h-24 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold">gradient-brand-diagonal</span>
          </div>
        </div>
      </section>

      {/* Glassmorphism */}
      <section className="gradient-brand-diagonal rounded-2xl p-10">
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-6">
          Glassmorphism
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-champagne mb-2">.glass</h3>
            <p className="text-text-secondary text-sm">
              Frosted glass card with backdrop blur, subtle border, and shadow.
            </p>
          </div>
          <div className="glass-hover rounded-xl p-6 cursor-pointer">
            <h3 className="text-lg font-semibold text-champagne mb-2">.glass-hover</h3>
            <p className="text-text-secondary text-sm">
              Hover over me — background brightens and border glows.
            </p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-6">
          Typography
        </h2>
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold font-[family-name:var(--font-heading)]">
            Heading 1 — Poppins Bold
          </h1>
          <h2 className="text-3xl font-semibold font-[family-name:var(--font-heading)]">
            Heading 2 — Poppins Semibold
          </h2>
          <h3 className="text-xl font-medium font-[family-name:var(--font-heading)]">
            Heading 3 — Poppins Medium
          </h3>
          <p className="text-base text-text-primary">
            Body text — Inter Regular. Good readability on dark backgrounds with the near-black
            base.
          </p>
          <p className="text-sm text-text-secondary">
            Secondary text — Inter, lighter weight for descriptions and captions.
          </p>
          <p className="text-xs text-text-muted">Muted text — Used for fine print and metadata.</p>
        </div>
      </section>

      {/* Focus Ring */}
      <section>
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-6">
          Interactive
        </h2>
        <div className="flex gap-4 flex-wrap">
          <button className="gradient-brand px-6 py-3 rounded-full text-white font-semibold focus-ring">
            Primary Button
          </button>
          <button className="glass-hover px-6 py-3 rounded-full text-champagne font-semibold focus-ring">
            Glass Button
          </button>
        </div>
      </section>
    </div>
  );
}
