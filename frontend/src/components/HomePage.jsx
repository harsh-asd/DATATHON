import React from "react";
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  BarChart3,
  Boxes,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Play
} from "lucide-react";

export default function HomePage({ onLaunchConsole }) {
  return (
    <div className="min-h-full bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-blue-100/50 via-slate-50 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DATATHON 2026 Innovation Track • Commerce Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Stop Burning Ad Spend on <span className="text-blue-600 underline decoration-blue-300 decoration-wavy decoration-2">Out-of-Stock SKUs</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            <strong>The Money Leak</strong> cross-references 18,000 transaction records and live warehouse inventory telemetry against 1,200 ad campaigns to isolate capital drain and explain root causes with machine learning.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onLaunchConsole}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 text-sm transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span>Launch Operations Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("architecture");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-2xs text-sm transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-blue-600" />
              <span>How It Works</span>
            </button>
          </div>

          {/* Trust Metric Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-200/80">
            <div className="p-3">
              <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900">18,000</span>
              <p className="text-xs text-slate-500 mt-0.5">Audited Transactions</p>
            </div>
            <div className="p-3">
              <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900">1,200</span>
              <p className="text-xs text-slate-500 mt-0.5">Monitored Campaigns</p>
            </div>
            <div className="p-3">
              <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900">250</span>
              <p className="text-xs text-slate-500 mt-0.5">Catalog SKUs</p>
            </div>
            <div className="p-3">
              <span className="text-xl sm:text-2xl font-bold font-mono text-blue-600">SHAP</span>
              <p className="text-xs text-slate-500 mt-0.5">Attribution Model</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Feature Spotlight / Anomaly Demo Card */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto pb-20">
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">Live Detection Teaser</span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">Autonomous Money Leak Attribution in Action</h2>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
              -$194,454 Active Capital Drain
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">The Leak Event</span>
              <div className="text-base font-bold text-slate-900">Campaign CA1179 (App Grocery)</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ad set continued full daily spend velocity while product SKU-892 hit 0 inventory units in warehouse telemetry.
              </p>
              <div className="pt-2 flex justify-between text-xs font-mono">
                <span className="text-slate-500">Spend: $1,663</span>
                <span className="text-rose-600 font-bold">Conversions: 101 units</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SHAP Mathematical Attribution</span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Stockout Flag</span>
                    <span className="text-rose-600 font-bold">-45% drag</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[45%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Ad Pacing Overshoot</span>
                    <span className="text-rose-600 font-bold">-28% drag</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[28%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Autonomous Remediation</span>
                <div className="text-sm font-bold text-slate-900 mt-1">One-Click Capital Protection</div>
                <p className="text-xs text-slate-600 mt-1">
                  Instantly caps ad budget, notifies supply chain logistics, and shifts remaining spend to high-converting search terms.
                </p>
              </div>

              <button
                onClick={onLaunchConsole}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Investigate In Operations Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3-Pillar Enterprise Capabilities */}
      <section id="features" className="py-16 bg-white border-y border-slate-200 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">Platform Pillars</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Built for Omnichannel Retail Scale</h2>
            <p className="text-sm text-slate-500">Eliminating the costly disconnect between marketing spend and supply chain realities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-blue-300 transition-colors">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700 w-fit">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Time-Series Random Forest Regressor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trained with strict chronological temporal splitting (<code className="bg-slate-200/80 px-1 py-0.5 rounded font-mono">shuffle=False</code>) to prevent future data leakage. Accurately forecasts daily revenue baseline from ad spend, channel, and category.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-blue-300 transition-colors">
              <div className="p-3 rounded-xl bg-rose-100 text-rose-700 w-fit">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">SHAP TreeExplainer Attribution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No black-box guesses. Game-theoretic Shapley Additive exPlanations quantify the exact dollar contribution of each variable: ad cost, audience click-through rate, and inventory stockouts.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-blue-300 transition-colors">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 w-fit">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Warehouse Inventory Sync</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct correlation of 5,000 warehouse inventory records against active media sets. Highlights supplier delay days, reorder thresholds, and active ad spend burning on unstocked products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Architecture Pipeline */}
      <section id="architecture" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">Full-Stack Pipeline</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">End-to-End Microservice Architecture</h2>
          <p className="text-sm text-slate-500">Engineered for real-time responsiveness and zero-latency operational control.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
              LAYER 1: ML SERVICE
            </span>
            <h4 className="text-base font-bold text-slate-900">Python FastAPI + Scikit-Learn</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trains on 1,200 chronological campaigns and 18,000 completed transaction records. Computes real-time predictions and top SHAP feature drivers via <code className="font-mono text-slate-700">/predict</code>.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              LAYER 2: DATA BRIDGE
            </span>
            <h4 className="text-base font-bold text-slate-900">Node.js / Express Server</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provides high-throughput bridge routes (<code className="font-mono text-slate-700">/api/anomalies</code>, <code className="font-mono text-slate-700">/api/inventory-risk</code>) and manages real-time campaign pause/resume states.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              LAYER 3: OPERATIONS UI
            </span>
            <h4 className="text-base font-bold text-slate-900">React + Vite + Tailwind CSS</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Alloy.ai signature enterprise light design system with interactive SVG revenue divergence curves, smart alert feeds, and SHAP explainability modals.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-16 bg-slate-900 text-white px-6 sm:px-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono font-semibold">ALL SYSTEMS LIVE & OPERATIONAL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to isolate and remediate retail money leaks?
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Launch the operations dashboard to evaluate flagged campaigns, inspect mathematical drivers, and stem capital erosion.
          </p>

          <button
            onClick={onLaunchConsole}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer hover:scale-105"
          >
            <span>Open Operations Console Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
