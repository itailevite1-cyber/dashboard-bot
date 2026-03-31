import { supabase } from "@/lib/supabase";
import { latestTrade, updates } from "@/data/mockData";

export async function seedInitialData() {
  console.log("Seeding initial data...");

  // Seed Latest Trade (if table is empty)
  const { data: tradeCheck } = await supabase.from('trades').select('id').limit(1);
  if (!tradeCheck || tradeCheck.length === 0) {
    await supabase.from('trades').insert([{
      date: latestTrade.date,
      direction: latestTrade.direction,
      entry: latestTrade.entry,
      exit: latestTrade.exit,
      profit: latestTrade.profit,
      streak: latestTrade.streak
    }]);
    console.log("Seeded initial trade.");
  }

  // Seed Updates (if table is empty)
  const { data: updateCheck } = await supabase.from('updates').select('id').limit(1);
  if (!updateCheck || updateCheck.length === 0) {
    const formattedUpdates = updates.map(u => ({
      title: u.title,
      date: u.date,
      content: u.content
    }));
    await supabase.from('updates').insert(formattedUpdates);
    console.log("Seeded initial updates.");
  }

  console.log("Seeding complete.");
}
