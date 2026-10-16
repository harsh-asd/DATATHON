import React from "react";
import { AlertCircle, AlertTriangle, ArrowUpRight, Clock, Sparkles } from "lucide-react";

export default function AlertCard({ alert, onInvestigate }) {
  const isCritical = alert.severity === "Critical" || alert.severity === "critical";

  return (
    <div
      className={`group relative p-5 rounded-xl border bg-white transition-all duration-200 cursor-pointer shadow-xs ${
        isCritical
          ? "border-slate-200/90 hover:border-rose-400 hover:shadow-md hover:shadow-rose-100/50 hover:-translate-y-0.5"
          : "border-slate-200/90 hover:border-amber-400 hover:shadow-md hover:shadow-amber-100/50 hover:-translate-y-0.5"
      }`}
    >
      {/* Crisp Alloy.ai Accent Color Strip */}
      <div
        className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl ${
          isCritical ? "bg-rose-500" : "bg-amber-500"
        }`}
      />

      {/* Header: Severity Badge + Timestamp */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isCritical
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {isCritical ? <AlertCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {alert.severity || "Warning"}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {alert.category || alert.channel || "Retail Metric"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{alert.timestamp || "Just now"}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
        {alert.title}
      </h3>

      {/* Metrics Delta: Expected vs Actual */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 mb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Expected Baseline</span>
          <div className="text-sm font-mono font-bold text-slate-800">
            {alert.expectedText || (alert.predicted_baseline ? `$${Math.round(alert.predicted_baseline).toLocaleString()}` : "$5,000")}
          </div>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Actual / Variance</span>
          <div className="text-sm font-mono font-bold text-rose-600 flex items-center gap-1">
            <span>{alert.actualText || (alert.actual_revenue ? `$${Math.round(alert.actual_revenue).toLocaleString()}` : "$3,200")}</span>
            <span className="text-xs font-medium text-rose-500">
              ({alert.deltaText || "-36%"})
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="truncate max-w-[240px] font-medium">
            {alert.driverSnippet || "ML attribution available"}
          </span>
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onInvestigate(alert);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold border border-slate-300 hover:border-blue-600 shadow-2xs transition-all cursor-pointer"
        >
          <span>Investigate Drivers</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
