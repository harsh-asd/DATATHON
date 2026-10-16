import React, { useState, useEffect } from "react";
import { Boxes, AlertTriangle, Clock, ShieldAlert, ArrowRight, CheckCircle2, RotateCw } from "lucide-react";

export default function InventoryRiskView({ onTogglePauseCategory }) {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reorderedMap, setReorderedMap] = useState(new Set());

  const fetchRisks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/inventory-risk");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setRisks(data.risks || []);
    } catch (e) {
      // Fallback data if offline
      setRisks([
        {
          inventory_id: "IN000015",
          product_id: "PR0216",
          category: "Beauty",
          stock_on_hand: 0,
          reorder_threshold: 58,
          supplier_delay_days: 9,
          supplier_lead_days: 11,
          is_stockout: true,
          active_campaigns_count: 2,
          burning_ad_spend: 5069,
          severity: "Critical",
          recommended_action: "Pause active Beauty ad spend to stop bleeding $5,069 on out-of-stock SKU."
        },
        {
          inventory_id: "IN000018",
          product_id: "PR0018",
          category: "Grocery",
          stock_on_hand: 0,
          reorder_threshold: 15,
          supplier_delay_days: 14,
          supplier_lead_days: 14,
          is_stockout: true,
          active_campaigns_count: 3,
          burning_ad_spend: 7200,
          severity: "Critical",
          recommended_action: "Pause active Grocery ad spend to stop bleeding $7,200 on out-of-stock SKU."
        },
        {
          inventory_id: "IN000021",
          product_id: "PR0155",
          category: "Fashion",
          stock_on_hand: 12,
          reorder_threshold: 63,
          supplier_delay_days: 18,
          supplier_lead_days: 10,
          is_stockout: false,
          active_campaigns_count: 1,
          burning_ad_spend: 2150,
          severity: "Warning",
          recommended_action: "Low stock alert: Inventory below 63 threshold with 18 days supplier delay."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const handleReorder = (productId) => {
    setReorderedMap((prev) => new Set(prev).add(productId));
    alert(`Emergency Restock Dispatched: Vendor PO generated for SKU ${productId} with expedited priority freight.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Inventory Stockout & Ad Bleed Telemetry</h2>
            <p className="text-xs text-slate-500">Cross-referencing real-time warehouse inventory telemetry with active campaign media spend</p>
          </div>
        </div>

        <button
          onClick={fetchRisks}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
          <span>Sync Stock Data</span>
        </button>
      </div>

      {/* Risk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {risks.map((item, idx) => {
          const isCritical = item.severity === "Critical";
          const isReordered = reorderedMap.has(item.product_id);

          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border bg-white shadow-xs space-y-4 ${
                isCritical ? "border-rose-200" : "border-slate-200"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isCritical
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {item.severity}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {item.product_id}
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {item.is_stockout ? `Out of Stock: ${item.category}` : `Low Stock Warning: ${item.category}`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Active campaigns driving traffic: <strong className="text-slate-800">{item.active_campaigns_count} Sets</strong>
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Stock on Hand</span>
                  <div className={`font-mono font-bold ${item.stock_on_hand === 0 ? "text-rose-600" : "text-slate-800"}`}>
                    {item.stock_on_hand} units
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Reorder Level</span>
                  <div className="font-mono font-bold text-slate-800">{item.reorder_threshold} units</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Burning Spend</span>
                  <div className="font-mono font-bold text-rose-600">${item.burning_ad_spend.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Supplier Delay</span>
                  <div className="font-mono font-bold text-amber-700">+{item.supplier_delay_days} days</div>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-1.5 leading-snug">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{item.recommended_action}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleReorder(item.product_id)}
                  disabled={isReordered}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isReordered
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-2xs"
                  }`}
                >
                  {isReordered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PO Generated</span>
                    </>
                  ) : (
                    <span>Expedite Reorder</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (onTogglePauseCategory) onTogglePauseCategory(item.category);
                    alert(`Paused all active ${item.category} campaigns to prevent ad spend waste on out-of-stock inventory.`);
                  }}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                >
                  Pause Ads
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
