import React, { useState, useMemo } from "react";
import AlertCard from "./AlertCard.jsx";
import { BellRing, RefreshCw, Search, Filter, SlidersHorizontal } from "lucide-react";

export const MOCK_ALERTS = [
  {
    id: "ALT-001",
    campaign_id: "CA1179",
    severity: "Critical",
    timestamp: "12 mins ago",
    category: "Grocery",
    channel: "App",
    title: "Critical: Projected Stockout on SKU-892 triggering revenue loss",
    expectedText: "$215,700 baseline",
    actualText: "$21,246 actual",
    deltaText: "-$194,454 (-90%)",
    spend: 1663.15,
    conversions: 101,
    actual_revenue: 21246,
    predicted_baseline: 215700,
    variance: -194454,
    driverSnippet: "Zero stock-on-hand halted conversions",
    topShapExplanations: [
      { feature: "Stockout Flag", impact: -45.0, direction: "negative", description: "Zero stock-on-hand for high-demand item halted order conversions" },
      { feature: "Ad Spend Pace", impact: -28.4, direction: "negative", description: "Ad campaign continued full spend ($1,663) while product was unavailable" },
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
    campaign_id: "CA1193",
    severity: "Critical",
    timestamp: "45 mins ago",
    category: "Sports",
    channel: "Web",
    title: "Critical: Web Sports ad set CPA surged past unit margin threshold",
    expectedText: "$180,540 baseline",
    actualText: "$51,292 actual",
    deltaText: "-$129,248 (-71%)",
    spend: 2994.01,
    conversions: 236,
    actual_revenue: 51292,
    predicted_baseline: 180540,
    variance: -129248,
    driverSnippet: "Customer acquisition cost spiked +44%",
    topShapExplanations: [
      { feature: "Ad Spend", impact: -41.2, direction: "negative", description: "Aggressive bid pacing increased cost-per-click from $0.62 to $1.15" },
      { feature: "Audience Fatigue", impact: -22.5, direction: "negative", description: "Click-through rate dropped 32% over past 72 hours" },
      { feature: "Category Discounting", impact: +8.0, direction: "positive", description: "Promotional discount cushioned conversion abandonment" }
    ],
    actions: [
      "Lower maximum target CPA bid limit by 25% on Web Sports channels.",
      "Refresh creative assets to overcome audience ad fatigue.",
      "Shift $750 to high-performing Search brand keywords."
    ]
  },
  {
    id: "ALT-003",
    campaign_id: "CA1185",
    severity: "Warning",
    timestamp: "2 hours ago",
    category: "Home",
    channel: "App",
    title: "Warning: High spend with depressed conversions in App Home set",
    expectedText: "$87,323 baseline",
    actualText: "$33,137 actual",
    deltaText: "-$54,186 (-62%)",
    spend: 4166.76,
    conversions: 150,
    actual_revenue: 33137,
    predicted_baseline: 87323,
    variance: -54186,
    driverSnippet: "18% of web checkout transactions marked Returned",
    topShapExplanations: [
      { feature: "Return Rate", impact: -38.0, direction: "negative", description: "Return rate surged due to delivery lead time delays" },
      { feature: "Discount Depth", impact: -24.0, direction: "negative", description: "Average discount exceeded 20%, depressing unit revenue" },
      { feature: "Category Baseline", impact: -18.0, direction: "negative", description: "Home decor seasonal demand softened" }
    ],
    actions: [
      "Cap discount code stacking limit at 15% maximum on App Home.",
      "Enable instant supplier shipment notification to reduce buyer regret.",
      "Audit checkout fraud and shipping ETA communication."
    ]
  }
];

export default function AlertFeed({ alerts = [], onInvestigate, onRefresh, loading }) {
  const baseAlerts = alerts.length > 0 ? alerts : MOCK_ALERTS;

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredAlerts = useMemo(() => {
    return baseAlerts.filter((item) => {
      // Search filter
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (item.id && item.id.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      // Severity filter
      const matchSeverity =
        severityFilter === "All" ||
        item.severity?.toLowerCase() === severityFilter.toLowerCase();

      // Channel filter
      const matchChannel =
        channelFilter === "All" ||
        item.channel?.toLowerCase().includes(channelFilter.toLowerCase());

      // Category filter
      const matchCategory =
        categoryFilter === "All" ||
        item.category?.toLowerCase().includes(categoryFilter.toLowerCase());

      return matchSearch && matchSeverity && matchChannel && matchCategory;
    });
  }, [baseAlerts, search, severityFilter, channelFilter, categoryFilter]);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Smart Alert Feed
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-50 border border-rose-200 text-rose-700">
                {filteredAlerts.length} Active Leaks
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

      {/* Filter Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaign ID or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-blue-500 shadow-2xs"
          />
        </div>

        {/* Severity */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium shadow-2xs cursor-pointer focus:outline-blue-500"
        >
          <option value="All">All Severity</option>
          <option value="Critical">Critical Only</option>
          <option value="Warning">Warning Only</option>
        </select>

        {/* Channel */}
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium shadow-2xs cursor-pointer focus:outline-blue-500"
        >
          <option value="All">All Channels</option>
          <option value="App">App</option>
          <option value="Web">Web</option>
          <option value="Social">Social</option>
          <option value="Email">Email</option>
          <option value="Store">Store</option>
        </select>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium shadow-2xs cursor-pointer focus:outline-blue-500"
        >
          <option value="All">All Categories</option>
          <option value="Grocery">Grocery</option>
          <option value="Beauty">Beauty</option>
          <option value="Fashion">Fashion</option>
          <option value="Sports">Sports</option>
          <option value="Electronics">Electronics</option>
          <option value="Home">Home</option>
        </select>
      </div>

      {/* Vertical Scrollable List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3.5 max-h-[700px] bg-slate-50/60">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 border border-dashed border-slate-300 rounded-xl bg-white">
            <Filter className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No matching anomalies found</p>
            <p className="text-xs text-slate-400 mt-1">Adjust filters or search criteria above.</p>
          </div>
        ) : (
          filteredAlerts.map((item, idx) => (
            <AlertCard
              key={item.id || item.campaign_id || idx}
              alert={item}
              onInvestigate={onInvestigate}
            />
          ))
        )}
      </div>
    </div>
  );
}
