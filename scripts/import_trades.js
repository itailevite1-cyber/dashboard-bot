const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function importTrades() {
  const tradesPath = path.join('/tmp', 'trades_data.json');
  if (!fs.existsSync(tradesPath)) {
    console.error('Data file not found at ' + tradesPath);
    process.exit(1);
  }

  const trades = JSON.parse(fs.readFileSync(tradesPath, 'utf8'));
  console.log(`Starting import of ${trades.length} trades...`);

  // Split into chunks of 10 to avoid payload limits
  for (let i = 0; i < trades.length; i += 10) {
    const chunk = trades.slice(i, i + 10);
    const { error } = await supabase.from('trades').insert(chunk);
    if (error) {
      console.error('Error inserting chunk at index ' + i + ':', error);
    } else {
      console.log(`Inserted trades ${i + 1} to ${Math.min(i + 10, trades.length)}`);
    }
  }

  console.log('Import completed.');
}

importTrades();
