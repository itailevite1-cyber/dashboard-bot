import { supabase } from "@/lib/supabase";
import { seedInitialData } from "@/lib/seed";
import DashboardContent from "@/components/DashboardContent";
import { guideCategories, faqData } from "@/data/mockData";

export default async function Home() {
  // Seed only if needed
  await seedInitialData();

  // Fetch from Supabase
  const { data: trades } = await supabase.from('trades').select('*').order('created_at', { ascending: false }).limit(1);
  const { data: updatesList } = await supabase.from('updates').select('*').order('created_at', { ascending: false });

  const latestTrade = trades?.[0] || {
    date: "---",
    direction: "---",
    entry: 0,
    exit: 0,
    profit: 0,
    streak: 0
  };

  return (
    <DashboardContent 
      latestTrade={latestTrade}
      updates={updatesList || []}
      guideCategories={guideCategories}
      faqData={faqData}
    />
  );
}
