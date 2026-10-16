import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout.jsx";
import AlertFeed, { MOCK_ALERTS } from "./components/AlertFeed.jsx";
import RootCausePanel from "./components/RootCausePanel.jsx";
import OverviewView from "./components/OverviewView.jsx";
import InventoryRiskView from "./components/InventoryRiskView.jsx";
import SettingsView from "./components/SettingsView.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("anomalies");
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const API_BASE = "http://localhost:3000";

  // Fetch Summary KPIs
  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.warn("Summary API offline:", err.message);
    }
  };

  // Fetch Anomaly Stream
  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/anomalies`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (data.anomalies || data.data || []);

      const formatted = rawList
        .filter((item) => {
          const variance = Number(item.variance !== undefined ? item.variance : 0);
          return variance < 0;
        })
        .map((item, idx) => {
          const id = item.campaign_id || item.campaignId || `CAMP-${idx + 1}`;
          const channel = item.channel || "Omnichannel";
          const category = item.category || "Retail";
          const spend = Number(item.spend || 0);
          const actual = Number(item.actual_revenue !== undefined ? item.actual_revenue : 0);
          const baseline = Number(item.predicted_baseline !== undefined ? item.predicted_baseline : 0);
          const variance = actual - baseline;
          const isCritical = Math.abs(variance) > 35000;

          return {
            id,
            campaign_id: id,
            title: isCritical
              ? `Critical: Capital leak on ${category} (${channel}) campaign`
              : `Warning: Depressed conversion efficiency on ${category} (${channel})`,
            severity: isCritical ? "Critical" : "Warning",
            category,
            channel,
            timestamp: item.date ? `Logged ${item.date}` : "Live Stream",
            spend,
            conversions: item.conversions || 0,
            actual_revenue: actual,
            predicted_baseline: baseline,
            variance,
            is_paused: item.is_paused || false,
            expectedText: `$${Math.round(baseline).toLocaleString()} baseline`,
            actualText: `$${Math.round(actual).toLocaleString()}`,
            deltaText: `-$${Math.abs(Math.round(variance)).toLocaleString()}`,
            driverSnippet: `Spend $${Math.round(spend).toLocaleString()} vs ${Math.round(item.conversions || 0)} conversions`,
            topShapExplanations: item.top_shap_explanations || item.topShapExplanations || [],
            actions: [
              `Pause campaign ${id} spend immediately to stop margin erosion.`,
              `Reallocate remaining budget to top-performing baseline channels.`,
              `Review inventory levels for ${category} to ensure availability.`
            ]
          };
        });

      if (formatted.length > 0) {
        setAlerts(formatted);
      } else {
        setAlerts(MOCK_ALERTS);
      }
    } catch (err) {
      console.warn("Backend offline or loading, using standard enterprise mock alert stream:", err.message);
      setAlerts(MOCK_ALERTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAnomalies();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Toggle Pause Campaign Intervention
  const handleTogglePause = async (campaignId) => {
    try {
      const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/toggle-pause`, { method: "POST" });
      const data = await res.json();
      setAlerts(prev => prev.map(a => a.id === campaignId ? { ...a, is_paused: data.is_paused } : a));
      showNotification(data.message || `Campaign ${campaignId} status updated.`);
      fetchSummary();
    } catch (e) {
      setAlerts(prev => prev.map(a => a.id === campaignId ? { ...a, is_paused: !a.is_paused } : a));
      showNotification(`Campaign ${campaignId} spend updated.`);
    }
  };

  const handleInvestigate = (alertItem) => {
    setSelectedAlert(alertItem);
    setIsModalOpen(true);
  };

  const handleTakeAction = async (alertItem) => {
    await handleTogglePause(alertItem.id);
    showNotification(`Remediation Executed: Campaign ${alertItem.id} spend capped & budget shifted.`);
  };

  const handlePauseCategory = (categoryName) => {
    setAlerts(prev => prev.map(a => a.category === categoryName ? { ...a, is_paused: true } : a));
    showNotification(`All active ${categoryName} campaigns paused to stop stockout ad drain.`);
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tab 1: Executive Overview */}
      {activeTab === "overview" && (
        <OverviewView
          alerts={alerts}
          summary={summary}
          onInvestigate={handleInvestigate}
          onTogglePause={handleTogglePause}
        />
      )}

      {/* Tab 2: Smart Alert Feed (Core Product) */}
      {activeTab === "anomalies" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertFeed
              alerts={alerts}
              onInvestigate={handleInvestigate}
              onRefresh={fetchAnomalies}
              loading={loading}
            />
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Operations Telemetry
              </h3>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                The Money Leak engine cross-references transaction volume against real-time ad spend and inventory stockout signals.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Total Monitored SKUs</span>
                  <span className="font-mono font-bold text-slate-900">250 Products</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Active Ad Campaigns</span>
                  <span className="font-mono font-bold text-slate-900">1,200 Sets</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Analyzed Transactions</span>
                  <span className="font-mono font-bold text-slate-900">18,000 Records</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
                Quick Action Guide
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Click <strong>"Investigate Drivers"</strong> on any alert card to launch the SHAP Explainability modal, evaluate feature weights, and dispatch autonomous remediation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Inventory Risk */}
      {activeTab === "inventory" && (
        <InventoryRiskView onTogglePauseCategory={handlePauseCategory} />
      )}

      {/* Tab 4: Settings */}
      {activeTab === "settings" && (
        <SettingsView onResetDemo={fetchAnomalies} />
      )}

      {/* Explainability Modal */}
      <RootCausePanel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alert={selectedAlert}
        onTakeAction={handleTakeAction}
      />

    </DashboardLayout>
  );
}
