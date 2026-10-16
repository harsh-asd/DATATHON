import React, { useState } from "react";
import {
  Home,
  LayoutDashboard,
  AlertOctagon,
  Boxes,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  AlertTriangle,
  Zap,
  Activity,
  ShieldAlert
} from "lucide-react";

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "anomalies", label: "Anomalies", icon: AlertOctagon, badge: "3 New" },
    { id: "inventory", label: "Inventory Risk", icon: Boxes },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* 1. Sidebar (Alloy.ai Light & Clear Navigation) */}
      <aside
        className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-30 shrink-0 shadow-[1px_0_4px_rgba(0,0,0,0.02)] ${
          collapsed ? "w-18" : "w-64"
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white">
          <div 
            onClick={() => onTabChange && onTabChange("home")}
            className="flex items-center gap-3 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity"
            title="Go to Homepage"
          >
            <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 shadow-sm shadow-blue-500/20">
              <Zap className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <span className="font-bold tracking-tight text-slate-900 text-base">LEAKOPS</span>
                <span className="block text-[10px] text-blue-600 font-semibold tracking-wider uppercase">Commerce Intelligence</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (!activeTab && item.id === "overview");

            return (
              <button
                key={item.id}
                onClick={() => onTabChange && onTabChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold border border-rose-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white hover:border hover:border-slate-200 transition-colors cursor-pointer text-xs font-medium"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /><span>Collapse Sidebar</span></div>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50/60">
        
        {/* 2. Top Bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between gap-4 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight shrink-0">
              LeakOps
            </h1>
            
            {/* Highly Visible Disclaimer Banner (Light Clear Style) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span><strong>Notice:</strong> Insights derived from synthetic educational data.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex lg:hidden items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-[11px] border border-amber-200 font-medium">
              <span>Demo Notice</span>
            </div>
            
            <div className="h-6 w-[1px] bg-slate-200 mx-1" />

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-800 font-semibold font-mono tracking-tight">ML ENGINE: READY</span>
            </div>
          </div>
        </header>

        {/* Scrollable Main Operations Body */}
        <main className={`flex-1 overflow-y-auto ${activeTab === "home" ? "p-0" : "px-8 py-6 space-y-6"}`}>
          
          {/* 3. Hero Section (Alloy.ai Light KPI Cards) - Shown on Operations Tabs */}
          {activeTab !== "home" && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Predicted Daily Revenue (Neutral color) */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 tracking-wider uppercase mb-2">
                  <span>PREDICTED DAILY REVENUE</span>
                  <span className="p-1 rounded bg-slate-100 text-slate-600">
                    <Activity className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-3xl font-bold font-mono text-slate-900 tracking-tight">
                  $184,250
                </div>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="font-medium text-slate-700">Statistical Baseline</span>
                  <span>•</span>
                  <span>Random Forest model</span>
                </div>
              </div>

              {/* Card 2: Actual Revenue (Showing a negative trend) */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 tracking-wider uppercase mb-2">
                  <span>ACTUAL REVENUE</span>
                  <span className="p-1 rounded bg-rose-50 text-rose-600">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-3xl font-bold font-mono text-rose-600 tracking-tight">
                  $129,480
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold font-mono text-rose-600">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>-$54,770 (-29.7% drag)</span>
                </div>
              </div>

              {/* Card 3: Active Stockout Risks (Highlighted in soft red) */}
              <div className="p-5 rounded-xl bg-rose-50/40 border border-rose-200/80 shadow-xs hover:border-rose-300 transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
                  <span>ACTIVE STOCKOUT RISKS</span>
                  <span className="p-1 rounded bg-rose-100 text-rose-700 border border-rose-200">
                    <Boxes className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-3xl font-bold font-mono text-rose-700 tracking-tight">
                  14 SKUs Critical
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-800 font-medium font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Impacts $38.4k ad traffic</span>
                </div>
              </div>

              {/* Card 4: Campaign Efficiency Drop (Highlighted in amber) */}
              <div className="p-5 rounded-xl bg-amber-50/40 border border-amber-200/80 shadow-xs hover:border-amber-300 transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-800 tracking-wider uppercase mb-2">
                  <span>CAMPAIGN EFFICIENCY DROP</span>
                  <span className="p-1 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-3xl font-bold font-mono text-amber-800 tracking-tight">
                  -41.2% ROAS
                </div>
                <div className="mt-2 text-xs text-amber-800 font-medium font-mono">
                  <span>High spend on low conversions</span>
                </div>
              </div>

            </section>
          )}

          {/* Dynamic Content Body */}
          <div className="w-full">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}
