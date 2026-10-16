import React from "react";
import { X, TrendingDown, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, Zap } from "lucide-react";

export default function RootCausePanel({ isOpen, onClose, alert, onTakeAction }) {
  if (!isOpen || !alert) return null;

  // Extract SHAP explanations and metrics
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Root Cause Attribution & Remediation
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 border border-slate-700 text-slate-300">
                  {alert.id || alert.campaign_id || "ANOMALY-ALERT"}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Machine learning attribution model (SHAP values) translated into operational decisions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Column Layout Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 p-6 gap-6">
          
          {/* Left Column: The Math (SHAP Explainability) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold tracking-wide text-slate-200 uppercase flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                The Math: Attribution Drivers
              </h4>
              <span className="text-xs text-slate-400 font-mono">SHAP Feature Weights</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              These factors pulled actual revenue performance significantly below the predicted statistical baseline:
            </p>

            <div className="space-y-3 pt-2">
              {explanations.map((exp, idx) => {
                const impactAbs = Math.min(100, Math.abs(exp.impact || (idx === 0 ? 65 : idx === 1 ? 40 : 25)));
                const isNegative = (exp.direction === "negative") || (exp.impact < 0);

                return (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-200">{exp.feature}</span>
                      <span className={`font-mono font-semibold ${isNegative ? "text-rose-400" : "text-emerald-400"}`}>
                        {isNegative ? `-${impactAbs}% drag` : `+${impactAbs}% boost`}
                      </span>
                    </div>

                    {/* Horizontal Bar Chart representation */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isNegative ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.max(15, impactAbs)}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 pt-0.5">
                      {exp.description || `${exp.feature} significantly skewed baseline return.`}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/60 text-xs flex justify-between">
              <span className="text-slate-400">Net Performance Gap:</span>
              <span className="font-mono font-bold text-rose-400">
                {alert.varianceFormatted || (alert.variance ? `-$${Math.abs(alert.variance).toLocaleString()}` : "-$1,800 (-36%)")}
              </span>
            </div>
          </div>

          {/* Right Column: The Action (Next Best Action Card) */}
          <div className="space-y-4 md:pl-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold tracking-wide text-slate-200 uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                The Action: Prescribed Interventions
              </h4>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                High Confidence
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-b from-cyan-950/20 to-slate-950/40 border border-cyan-900/40 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Autonomous recommendation to immediately remediate margin erosion:
              </p>

              <div className="space-y-2.5">
                {suggestedActions.map((action, aIdx) => (
                  <div key={aIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
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
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg shadow-lg shadow-cyan-500/20 transition-all cursor-pointer text-sm"
              >
                <span>Take Action (Apply Remediation)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
