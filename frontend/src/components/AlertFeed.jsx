import React from "react";
import AlertCard from "./AlertCard.jsx";
import { BellRing, Filter, RefreshCw } from "lucide-react";

// 3 Diverse default enterprise alert examples
export const MOCK_ALERTS = [
  {
    id: "ALT-001",
    severity: "Critical",
    timestamp: "12 mins ago",
    category: "Grocery / App",
    title: "Critical: Projected Stockout on SKU-892 triggering revenue loss",
    expectedText: "$5,000 baseline",
    actualText: "$3,200 actual",
    deltaText: "-$1,800 (-36%)",
    driverSnippet: "Stockout flag active + Ad spend unchanged",
    topShapExplanations: [
      { feature: "Stockout Flag", impact: -45.0, direction: "negative", description: "Zero stock-on-hand for high-demand item halted order conversions" },
      { feature: "Ad Spend Pace", impact: -28.4, direction: "negative", description: "Ad campaign continued full spend ($2,400) while product was unavailable" },
      { feature: "Click Conversion", impact: -14.6, direction: "negative", description: "Bounce rate on product landing page spiked to 88%" }
    ],
    actions: [
      "Pause App Grocery ad campaign CA1179 immediately to cease non-converting traffic.",
      "Trigger expedited restock reorder of 150 units from primary vendor.",
      "Re-route active ad budget to in-stock Electronics alternatives."
    ]
  },
  {
    id: "ALT-002",
    severity: "Warning",
    timestamp: "45 mins ago",
    category: "Fashion / Social",
    title: "Warning: Campaign 'Summer Sale' ROI drop on Social channel",
    expectedText: "$14,800 baseline",
    actualText: "$9,100 actual",
    deltaText: "-$5,700 (-38.5%)",
    driverSnippet: "Customer acquisition cost spiked +44%",
    topShapExplanations: [
      { feature: "Ad Spend", impact: -41.2, direction: "negative", description: "Aggressive bid pacing increased cost-per-click from $0.62 to $1.15" },
      { feature: "Audience Fatigue", impact: -22.5, direction: "negative", description: "Click-through rate dropped 32% over past 72 hours" },
      { feature: "Category Discounting", impact: +8.0, direction: "positive", description: "Promotional discount cushioned conversion abandonment" }
    ],
    actions: [
      "Lower maximum target CPA bid limit by 25% on Social channels.",
      "Refresh creative assets to overcome audience ad fatigue.",
      "Shift $750 to high-performing Search brand keywords."
    ]
  },
  {
    id: "ALT-003",
    severity: "Critical",
    timestamp: "2 hours ago",
    category: "Sports / Web",
    title: "Critical: Severe margin compression on Web Sports storefront",
    expectedText: "$28,400 baseline",
    actualText: "$14,200 actual",
    deltaText: "-$14,200 (-50%)",
    driverSnippet: "Return rate surged + High coupon stack",
    topShapExplanations: [
      { feature: "Order Cancellation Rate", impact: -52.0, direction: "negative", description: "18% of web checkout transactions marked Returned or Cancelled" },
      { feature: "Discount Depth", impact: -31.0, direction: "negative", description: "Average discount exceeded 22%, destroying unit gross margin" },
      { feature: "Supplier Delivery Delay", impact: -17.0, direction: "negative", description: "Supplier lead time delay (14 days) prompted customer cancellations" }
    ],
    actions: [
      "Cap discount code stacking limit at 15% maximum on Web Sports.",
      "Enable instant supplier shipment notification to reduce buyer regret.",
      "Audit checkout fraud and shipping ETA communication."
    ]
  }
];

export default function AlertFeed({ alerts = [], onInvestigate, onRefresh, loading }) {
  // Use passed live alerts or fallback to the 3 mock diverse alerts
  const displayAlerts = alerts.length > 0 ? alerts : MOCK_ALERTS;

  return (
    <div className="flex flex-col h-full bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Feed Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              Smart Alert Feed
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-rose-500/10 border border-rose-500/20 text-rose-400">
                {displayAlerts.length} Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">Real-time performance changes & forecasted operational leaks</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh Alert Stream"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Vertical Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[700px] scrollbar-thin scrollbar-thumb-slate-800">
        {displayAlerts.map((item, idx) => (
          <AlertCard
            key={item.id || item.campaign_id || idx}
            alert={item}
            onInvestigate={onInvestigate}
          />
        ))}
      </div>
    </div>
  );
}
