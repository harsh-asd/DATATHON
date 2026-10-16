const fs = require('fs');
const path = require('path');

let cache = null;
function getInventory() {
  if (!cache) {
    const p = path.join(__dirname, 'data', 'inventory.json');
    cache = JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  return cache;
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = getInventory();
    return res.status(200).json({
      success: true,
      count: data.length,
      risks: data
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      count: 0,
      risks: [],
      error: err.message
    });
  }
};
