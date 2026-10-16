const pausedSet = new Set();
const budgetMap = new Map();

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, action } = req.query;
  const campaignId = id || req.body?.campaign_id || 'CA1179';

  if (action === 'toggle-pause' || req.url.includes('toggle-pause')) {
    const isPaused = !pausedSet.has(campaignId);
    if (isPaused) {
      pausedSet.add(campaignId);
    } else {
      pausedSet.delete(campaignId);
    }
    return res.status(200).json({
      success: true,
      campaign_id: campaignId,
      is_paused: isPaused,
      message: isPaused ? `Campaign ${campaignId} spend paused.` : `Campaign ${campaignId} resumed.`
    });
  }

  if (action === 'shift-budget' || req.url.includes('shift-budget')) {
    const amount = Number(req.body?.amount || 500);
    const cur = budgetMap.get(campaignId) || 0;
    budgetMap.set(campaignId, cur + amount);
    return res.status(200).json({
      success: true,
      campaign_id: campaignId,
      shifted_amount: budgetMap.get(campaignId),
      message: `Shifted $${amount} from campaign ${campaignId} to baseline retargeting.`
    });
  }

  return res.status(200).json({ success: true, message: "OK" });
};
