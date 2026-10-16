import React from "react";
import { Download, TrendingDown, AlertTriangle, ArrowUpRight, ShieldCheck, Pause, Play, BarChart3, Layers } from "lucide-react";

export default function OverviewView({ alerts, summary, onInvestigate, onTogglePause }) {
  // Compute category leak totals
  const categoryLeaks = [
    { name: "Grocery", leak: 194453, percentage: 78, color: "bg-rose-500", channel: "App" },
    { name: "Sports", leak: 129247, percentage: 65, color: "bg-rose-500", channel: "Web" },
    { name: "Home", leak: 54185, percentage: 42, color: "bg-amber-500", channel: "App" },
    { name: "Electronics", leak: 32932, percentage: 35, color: "bg-amber-500", channel: "Store" },
    { name: "Fashion", leak: 29180, percentage: 31, color: "bg-amber-500", channel: "App" },
    { name: "Beauty", leak: 22055, percentage: 26, color: "bg-blue-500", channel: "Web" }
  ];

  // Top 5 most critical anomalies
  const topBleeders = [...alerts]
    .sort((a, b) => Math.abs(b.variance || 0) - Math.abs(a.variance || 0))
    .slice(0, 5);

  const exportAuditCSV = () => {
    const headers = ["Campaign ID", "Category", "Channel", "Spend", "Conversions", "Actual Revenue", "Predicted Baseline", "Variance Leak", "Status"];
    const rows = alerts.map(a => [
      a.id,
      a.category,
      a.channel,
      a.spend,
      a.conversions,
      a.actual_revenue,
      a.predicted_baseline,
      a.variance,
      a.is_paused ? "Paused" : "Active"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `the_money_leak_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Export Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Executive Anomaly Overview</h2>
          <p className="text-xs text-slate-500">Cross-channel ad spend variance and high-priority margin risks</p>
        </div>
        <button
          onClick={exportAuditCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Report (CSV)</span>
        </button>
      </div>

      {/* Visual Charts Grid: Leaks by Category & Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Leak Breakdown */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Capital Drain by Product Category
            </h3>
            <span className="text-xs font-mono font-semibold text-rose-600">Total: -$462.0k</span>
          </div>

          <div className="space-y-3 pt-1">
            {categoryLeaks.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">{cat.name} ({cat.channel})</span>
                  <span className="font-mono font-bold text-slate-900">-${cat.leak.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Health Matrix */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Channel Attribution & Return Status
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              5 Channels Monitored
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">App Channel</span>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">7,115 Orders</div>
              <div className="text-xs text-rose-600 font-medium mt-0.5">Highest Variance Drain</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Web Channel</span>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">8,092 Orders</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Primary Volume Driver</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Store Channel</span>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">2,793 Orders</div>
              <div className="text-xs text-emerald-600 font-medium mt-0.5">Stable Unit Margin</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Social & Email</span>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1">1,200 Sets</div>
              <div className="text-xs text-amber-600 font-medium mt-0.5">High Ad Fatigue Index</div>
            </div>
          </div>
        </div>

      </div>

      {/* Top 5 Critical Bleeding Campaigns Table */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Top 5 Capital Bleeders (Immediate Action Required)</h3>
            <p className="text-xs text-slate-500">Campaigns with the largest divergence between ad spend and realized net conversions</p>
          </div>
          <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            High Severity
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Campaign ID</th>
                <th className="py-3 px-4">Category & Channel</th>
                <th className="py-3 px-4">Ad Spend</th>
                <th className="py-3 px-4">Conversions</th>
                <th className="py-3 px-4">Realized Rev</th>
                <th className="py-3 px-4">Variance (Leak)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {topBleeders.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{item.category}</span>
                    <span className="text-slate-400"> ({item.channel})</span>
                  </td>
                  <td className="py-3 px-4 font-mono">${Math.round(item.spend).toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono">{item.conversions || 0} units</td>
                  <td className="py-3 px-4 font-mono">${Math.round(item.actual_revenue || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-600">
                    -${Math.abs(Math.round(item.variance || 0)).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {item.is_paused ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-300">
                        Paused
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Bleeding
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => onTogglePause && onTogglePause(item.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        item.is_paused
                          ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                          : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                      }`}
                    >
                      {item.is_paused ? "Resume" : "Pause Spend"}
                    </button>
                    <button
                      onClick={() => onInvestigate && onInvestigate(item)}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
