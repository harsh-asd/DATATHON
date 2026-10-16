// Re-export anomalies data
const fs = require('fs');
const path = require('path');

let cache = null;
function getAnomalies() {
  if (!cache) {
    const p = path.join(__dirname, 'data', 'anomalies.json');
    cache = JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  return cache;
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = getAnomalies();
    const { category, channel, limit = 30 } = req.query;
    let filtered = [...data];

    if (category && category !== 'All') {
      filtered = filtered.filter(a => a.category && a.category.toLowerCase() === category.toLowerCase());
    }
    if (channel && channel !== 'All') {
      filtered = filtered.filter(a => a.channel && a.channel.toLowerCase() === channel.toLowerCase());
    }

    const maxLimit = parseInt(limit) || 30;
    const slice = filtered.slice(0, maxLimit);

    return res.status(200).json({
      success: true,
      count: slice.length,
      anomalies: slice,
      data: slice
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      count: 0,
      anomalies: [],
      error: err.message
    });
  }
};
