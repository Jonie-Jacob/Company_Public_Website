export default function Home() {
  return (
    <div className="flex flex-col gap-20 px-8 py-20 max-w-5xl mx-auto">
      {/* Hero / Gradient text */}
      <section className="text-center">
        <h1 className="gradient-text-bright text-5xl md:text-6xl font-bold font-[family-name:var(--font-heading)] mb-4 leading-tight">
          Empowering Dreams. Engineering Reality.
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Zyphr — Design system preview. This page validates brand colors, typography, gradients,
          and glassmorphism.
        </p>
      </section>

      {/* Color Swatches */}
      <section>
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-8">
          Brand Colors
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-purple shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
            <span className="text-sm text-text-secondary">Purple</span>
            <span className="text-xs text-text-muted">#7B2FBE</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-ceylon-blue shadow-[0_0_20px_rgba(96,165,250,0.3)]" />
            <span className="text-sm text-text-secondary">Ceylon Blue</span>
            <span className="text-xs text-text-muted">#2563EB</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-champagne shadow-[0_0_20px_rgba(247,231,206,0.2)]" />
            <span className="text-sm text-text-secondary">Champagne</span>
            <span className="text-xs text-text-muted">#F7E7CE</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-charcoal ring-1 ring-white/20" />
            <span className="text-sm text-text-secondary">Charcoal</span>
            <span className="text-xs text-text-muted">#1A1A2E</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-near-black ring-1 ring-white/20" />
            <span className="text-sm text-text-secondary">Near Black</span>
            <span className="text-xs text-text-muted">#0F0F1A</span>
          </div>
        </div>
      </section>

      {/* Gradient Backgrounds */}
      <section>
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-8">
          Gradients
        </h2>
        <div className="flex flex-col gap-6">
          <div className="gradient-brand h-28 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.25)]">
            <span className="text-white font-semibold text-lg">gradient-brand</span>
          </div>
          <div className="gradient-brand-diagonal h-28 rounded-2xl flex items-center justify-center ring-1 ring-white/10 shadow-[0_0_40px_rgba(96,165,250,0.15)]">
            <span className="text-white font-semibold text-lg">gradient-brand-diagonal</span>
          </div>
        </div>
      </section>

      {/* Glassmorphism */}
      <section className="gradient-brand-diagonal rounded-2xl p-10">
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-8">
          Glassmorphism
        </h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="glass p-8">
            <h3 className="text-lg font-semibold text-champagne mb-3">.glass</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Thick curved glass with specular edge highlights and inner refraction glow.
            </p>
          </div>
          <div className="glass-hover p-8 cursor-pointer">
            <h3 className="text-lg font-semibold text-champagne mb-3">.glass-hover</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Hover me — 3D lift with purple glow, brighter edge reflections, and depth shadow.
            </p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-8">
          Typography
        </h2>
        <div className="flex flex-col gap-5">
          <h3 className="gradient-text-bright text-5xl font-bold font-[family-name:var(--font-heading)]">
            Heading 1 — Poppins Bold
          </h3>
          <h3 className="text-3xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
            Heading 2 — Poppins Semibold
          </h3>
          <h4 className="text-xl font-medium font-[family-name:var(--font-heading)] text-text-primary">
            Heading 3 — Poppins Medium
          </h4>
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

      {/* Interactive */}
      <section>
        <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] text-champagne mb-8">
          Interactive
        </h2>
        <div className="flex gap-6 flex-wrap">
          <button className="gradient-brand px-8 py-3.5 rounded-full text-white font-semibold focus-ring shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-shadow">
            Primary Button
          </button>
          <button className="glass-btn px-8 py-3.5 rounded-full text-champagne font-semibold focus-ring">
            Glass Button
          </button>
          <button className="px-8 py-3.5 rounded-full border border-purple-light/50 text-purple-light font-semibold focus-ring hover:bg-purple-light/10 transition-colors">
            Outline Button
          </button>
        </div>
      </section>
    </div>
  );
}
