import React, { useState } from "react";
import { Sliders, Bell, Shield, Webhook, Check, RotateCcw } from "lucide-react";

export default function SettingsView({ onResetDemo }) {
  const [minVariance, setMinVariance] = useState(15000);
  const [autoPause, setAutoPause] = useState(false);
  const [confidence, setConfidence] = useState("95%");
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.slack.com/services/retail-ops/anomalies");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Settings Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Operational Anomaly & Threshold Configuration</h2>
        <p className="text-xs text-slate-500 mt-1">Configure ML sensitivity, autonomous guardrails, and real-time alert dispatching</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ML Sensitivity Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Machine Learning Thresholds</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-800">Minimum Variance to Flag Anomaly</span>
                <span className="font-mono font-bold text-blue-600">${minVariance.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="2500"
                value={minVariance}
                onChange={(e) => setMinVariance(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">Lower values flag minor shifts; higher values isolate catastrophic capital leaks.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">Model Statistical Confidence Interval</label>
              <div className="grid grid-cols-3 gap-3">
                {["90%", "95%", "99%"].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setConfidence(val)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                      confidence === val
                        ? "bg-blue-50 text-blue-700 border-blue-300 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {val} Confidence
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Autonomous Guardrails */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Autonomous Guardrails</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Auto-Pause Critical Out-of-Stock Bleeds</span>
                <span className="text-[11px] text-slate-500">Automatically pause ad sets when stockout flag is detected on landing SKU</span>
              </div>
              <input
                type="checkbox"
                checked={autoPause}
                onChange={(e) => setAutoPause(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Webhooks & Notification Dispatch */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Webhook className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Real-Time Alert Dispatching (Webhook)</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Slack / Teams Alert Webhook URL</label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-blue-500"
            />
          </div>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? "Configuration Saved!" : "Save Configuration"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onResetDemo) onResetDemo();
              alert("Demo session reset to baseline state.");
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>

      </form>
    </div>
  );
}
