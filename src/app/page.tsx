import { supabase } from "@/lib/supabase";
import { seedInitialData } from "@/lib/seed";
import DashboardContent from "@/components/DashboardContent";
import { guideCategories, faqData } from "@/data/mockData";

export default async function Home() {
  // Seed only if needed
  await seedInitialData();

  // Fetch latest trade specifically for dashboard
  const { data: dashboardTradeData } = await supabase.from('dashboard_trade').select('*').eq('id', 1).single();
  const { data: updatesList } = await supabase.from('updates').select('*').order('created_at', { ascending: false });
  
  const latestTrade = dashboardTradeData || {
    date: "07.04",
    direction: "Short",
    entry: 24249,
    exit: 24199,
    profit: 1248,
    streak: 3
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
