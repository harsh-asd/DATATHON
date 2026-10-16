const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/money_leak';

// Flexible Mongoose Schemas (strict: false allows ingestion of any CSV columns)
const Campaign = mongoose.model('Campaign', new mongoose.Schema({}, { strict: false }));
const Transaction = mongoose.model('Transaction', new mongoose.Schema({}, { strict: false }));

// Resolve CSV file path from multiple potential locations
function findCsvPath(fileName) {
  const possiblePaths = [
    path.join(__dirname, fileName),
    path.join(__dirname, '..', 'ml-service', fileName),
    path.join(process.cwd(), fileName),
    path.join(process.cwd(), 'ml-service', fileName)
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Helper to stream & parse CSV into JSON objects with numeric casting
function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const parsedRow = {};
        for (const [key, value] of Object.entries(row)) {
          const cleanKey = key.trim();
          const cleanVal = typeof value === 'string' ? value.trim() : value;

          // Parse numeric fields automatically
          if (cleanVal !== '' && !isNaN(Number(cleanVal))) {
            parsedRow[cleanKey] = Number(cleanVal);
          } else {
            parsedRow[cleanKey] = cleanVal;
          }
        }
        records.push(parsedRow);
      })
      .on('end', () => resolve(records))
      .on('error', (err) => reject(err));
  });
}

// Fallback generator in case CSV files haven't been exported yet
function generateFallbackData() {
  const campaigns = [
    { campaign_id: 'CAMP-001', name: 'Summer Kickoff', channel: 'social', spend: 3200, clicks: 1200, impressions: 45000, actual_revenue: 1100, date: '2025-06-01' },
    { campaign_id: 'CAMP-002', name: 'Brand Search', channel: 'search', spend: 4500, clicks: 3100, impressions: 80000, actual_revenue: 14200, date: '2025-06-02' },
    { campaign_id: 'CAMP-003', name: 'Display Retargeting', channel: 'display', spend: 2800, clicks: 800, impressions: 60000, actual_revenue: 950, date: '2025-06-03' },
    { campaign_id: 'CAMP-004', name: 'Affiliate Push', channel: 'influencer', spend: 5000, clicks: 1400, impressions: 90000, actual_revenue: 1800, date: '2025-06-04' },
    { campaign_id: 'CAMP-005', name: 'Newsletter Promo', channel: 'email', spend: 750, clicks: 2200, impressions: 30000, actual_revenue: 4100, date: '2025-06-05' },
    { campaign_id: 'CAMP-006', name: 'Weekend Flash Sale', channel: 'social', spend: 3900, clicks: 950, impressions: 52000, actual_revenue: 1300, date: '2025-06-06' },
    { campaign_id: 'CAMP-007', name: 'Product Launch Search', channel: 'search', spend: 4100, clicks: 2900, impressions: 71000, actual_revenue: 12800, date: '2025-06-07' },
    { campaign_id: 'CAMP-008', name: 'Programmatic Video', channel: 'display', spend: 3100, clicks: 720, impressions: 64000, actual_revenue: 890, date: '2025-06-08' },
    { campaign_id: 'CAMP-009', name: 'Creator Sponsorship', channel: 'influencer', spend: 4800, clicks: 1150, impressions: 88000, actual_revenue: 1500, date: '2025-06-09' },
    { campaign_id: 'CAMP-010', name: 'VIP Early Access', channel: 'email', spend: 850, clicks: 2400, impressions: 34000, actual_revenue: 4600, date: '2025-06-10' }
  ];

  const transactions = campaigns.map((c, i) => ({
    transaction_id: `TX-${1000 + i}`,
    campaign_id: c.campaign_id,
    revenue: c.actual_revenue,
    date: c.date
  }));

  return { campaigns, transactions };
}

async function seed() {
  try {
    console.log(`[Seed] Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected successfully.');

    // 1. Locate CSV files
    let campaignsPath = findCsvPath('campaigns.csv');
    let transactionsPath = findCsvPath('transactions.csv');

    let campaignsData = [];
    let transactionsData = [];

    if (campaignsPath && transactionsPath) {
      console.log(`[Seed] Reading ${campaignsPath}...`);
      campaignsData = await parseCsvFile(campaignsPath);

      console.log(`[Seed] Reading ${transactionsPath}...`);
      transactionsData = await parseCsvFile(transactionsPath);
    } else {
      console.warn('[Seed] CSV files not found on disk. Generating standard seed dataset...');
      const fallback = generateFallbackData();
      campaignsData = fallback.campaigns;
      transactionsData = fallback.transactions;
    }

    // 2. Clear previous collections
    await Campaign.deleteMany({});
    await Transaction.deleteMany({});
    console.log('[Seed] Cleared existing Campaign and Transaction collections.');

    // 3. Bulk insert
    if (campaignsData.length > 0) {
      await Campaign.insertMany(campaignsData);
      console.log(`[Seed] Successfully inserted ${campaignsData.length} campaign records.`);
    }

    if (transactionsData.length > 0) {
      await Transaction.insertMany(transactionsData);
      console.log(`[Seed] Successfully inserted ${transactionsData.length} transaction records.`);
    }

    console.log('[Seed] Database seeding completed successfully.');
  } catch (error) {
    console.error('[Seed] Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB.');
  }
}

seed();
