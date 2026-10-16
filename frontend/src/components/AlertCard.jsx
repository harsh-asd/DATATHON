import React from "react";
import { AlertCircle, AlertTriangle, ArrowUpRight, Clock, DollarSign, Sparkles } from "lucide-react";

export default function AlertCard({ alert, onInvestigate }) {
  const isCritical = alert.severity === "Critical" || alert.severity === "critical";

  return (
    <div
      className={`group relative p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
        isCritical
          ? "bg-slate-900/70 border-slate-800 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-950/30 hover:-translate-y-0.5"
          : "bg-slate-900/70 border-slate-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-950/30 hover:-translate-y-0.5"
      }`}
    >
      {/* Glow Accent Bar */}
      <div
        className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl ${
          isCritical ? "bg-rose-500 group-hover:bg-rose-400" : "bg-amber-500 group-hover:bg-amber-400"
        }`}
      />

      {/* Header: Severity Badge + Timestamp */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isCritical
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
            }`}
          >
            {isCritical ? <AlertCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {alert.severity || "Warning"}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {alert.category || alert.channel || "Retail Metric"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{alert.timestamp || "Just now"}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-100 mb-3 group-hover:text-white transition-colors">
        {alert.title}
      </h3>

      {/* Metrics Delta: Expected vs Actual */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 mb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Expected Baseline</span>
          <div className="text-sm font-mono font-semibold text-slate-300">
            {alert.expectedText || (alert.predicted_baseline ? `$${Math.round(alert.predicted_baseline).toLocaleString()}` : "$5,000")}
          </div>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Actual / Variance</span>
          <div className="text-sm font-mono font-semibold text-rose-400 flex items-center gap-1">
            <span>{alert.actualText || (alert.actual_revenue ? `$${Math.round(alert.actual_revenue).toLocaleString()}` : "$3,200")}</span>
            <span className="text-xs font-normal text-rose-400/80">
              ({alert.deltaText || "-36%"})
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate max-w-[220px]">
            {alert.driverSnippet || "ML attribution available"}
          </span>
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onInvestigate(alert);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-medium border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer shadow-sm"
        >
          <span>Investigate Drivers</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
