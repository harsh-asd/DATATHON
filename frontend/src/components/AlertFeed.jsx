import React from "react";
import AlertCard from "./AlertCard.jsx";
import { BellRing, RefreshCw } from "lucide-react";

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
  const displayAlerts = alerts.length > 0 ? alerts : MOCK_ALERTS;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Feed Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Smart Alert Feed
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-50 border border-rose-200 text-rose-700">
                {displayAlerts.length} Flagged
              </span>
            </h2>
            <p className="text-xs text-slate-500">Real-time performance changes & forecasted operational leaks</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh Alert Stream"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Vertical Scrollable List in Light Grey Canvas */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3.5 max-h-[700px] bg-slate-50/60">
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
