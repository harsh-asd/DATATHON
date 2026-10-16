import React from "react";
import { X, TrendingDown, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import { ShapWaterfallChart } from "./Charts.jsx";

export default function RootCausePanel({ isOpen, onClose, alert, onTakeAction }) {
  if (!isOpen || !alert) return null;

  const explanations = alert.topShapExplanations || alert.top_shap_explanations || [
    { feature: "Ad Spend", impact: -42.5, direction: "negative", description: "Spend pace exceeded conversion velocity by +42%" },
    { feature: "Click-Through Rate", impact: -18.2, direction: "negative", description: "CTR dropped 18% below category baseline expectation" },
    { feature: "Inventory Stockout", impact: -31.0, direction: "negative", description: "Active stockout on target SKU caused conversion drop" }
  ];

  const suggestedActions = alert.actions || [
    "Cap daily campaign budget by 40% immediately to stop negative cash drain.",
    "Reallocate $1,500 unspent capital to high-converting baseline search sets.",
    "Flag SKU stockout to supply chain logistics for priority vendor expediting."
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Root Cause Attribution & Remediation
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-slate-200/80 text-slate-800">
                  {alert.id || alert.campaign_id || "ANOMALY-ALERT"}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Explainable ML (SHAP values) translated into operational decisions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Column Layout Split */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-6 gap-6 bg-white">
          
          {/* Left Column: The Math (SHAP Explainability) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                The Math: Attribution Drivers
              </h4>
              <span className="text-xs font-mono font-semibold text-slate-500">SHAP Waterfall</span>
            </div>

            {/* Visual Waterfall decomposition chart */}
            <ShapWaterfallChart alert={alert} />

            <p className="text-xs text-slate-600 leading-relaxed">
              These factors pulled actual revenue performance significantly below the predicted statistical baseline:
            </p>

            <div className="space-y-3 pt-1">
              {explanations.map((exp, idx) => {
                const impactAbs = Math.min(100, Math.abs(exp.impact || (idx === 0 ? 65 : idx === 1 ? 40 : 25)));
                const isNegative = (exp.direction === "negative") || (exp.impact < 0);

                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{exp.feature}</span>
                      <span className={`font-mono font-bold ${isNegative ? "text-rose-600" : "text-emerald-600"}`}>
                        {isNegative ? `-${impactAbs}% drag` : `+${impactAbs}% boost`}
                      </span>
                    </div>

                    {/* Horizontal Bar Chart */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isNegative ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.max(15, impactAbs)}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 pt-0.5">
                      {exp.description || `${exp.feature} significantly skewed baseline return.`}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs flex justify-between items-center">
              <span className="font-medium text-rose-800">Net Performance Gap:</span>
              <span className="font-mono font-bold text-rose-700 text-sm">
                {alert.varianceFormatted || (alert.variance ? `-$${Math.abs(alert.variance).toLocaleString()}` : "-$1,800 (-36%)")}
              </span>
            </div>
          </div>

          {/* Right Column: The Action (Next Best Action Card) */}
          <div className="space-y-4 md:pl-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                The Action: Prescribed Interventions
              </h4>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                High Confidence
              </span>
            </div>

            <div className="p-4.5 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3">
              <p className="text-xs text-slate-700 font-semibold">
                Autonomous recommendation to immediately remediate margin erosion:
              </p>

              <div className="space-y-2.5">
                {suggestedActions.map((action, aIdx) => (
                  <div key={aIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Projected impact: Stems ~$3,400 weekly cash burn across affected channel.</span>
            </div>

            {/* Confirmation Action Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onTakeAction) onTakeAction(alert);
                  else alert("Remediation plan applied: Campaign spend capped and budget reallocated.");
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer text-sm"
              >
                <span>Take Action (Apply Remediation)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
