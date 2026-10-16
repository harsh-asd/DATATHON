module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    success: true,
    predictedDailyRevenue: 184250,
    actualDailyRevenue: 129480,
    revenueDrag: -54770,
    dragPercentage: -29.7,
    activeStockoutRisks: "296 SKUs Critical",
    campaignEfficiencyDrop: "-41.2% ROAS",
    totalMonitoredCampaigns: 1200,
    pausedCampaignsCount: 0,
    totalMonitoredSKUs: 250,
    analyzedTransactions: 18000
  });
};
