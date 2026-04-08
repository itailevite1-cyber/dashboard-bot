"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    throw new Error("Unauthorized");
  }
}

export async function addAuthorizedUser(email: string) {
  await checkAdmin();
  const { error } = await supabase
    .from('authorized_users')
    .insert([{ email, is_admin: false }]);
  
  if (error) throw error;
  revalidatePath('/admin');
}

export async function removeAuthorizedUser(email: string) {
  await checkAdmin();
  const { error } = await supabase
    .from('authorized_users')
    .delete()
    .eq('email', email);
  
  if (error) throw error;
  revalidatePath('/admin');
}

export async function updateLatestTrade(trade: any) {
  await checkAdmin();
  const { error } = await supabase
    .from('trades')
    .insert([trade]); // Always insert new for history, dashboard picks latest
  
  if (error) throw error;

  // Auto-sync backtesting stats with advanced calculations
  const { data: allTrades } = await supabase.from('trades').select('profit');
  const { data: currentStats } = await supabase.from('backtesting').select('*').eq('id', 1).single();
  
  if (allTrades && currentStats) {
    const totalTrades = allTrades.length;
    const profitableTrades = allTrades.filter(t => t.profit > 0);
    const losingTrades = allTrades.filter(t => t.profit < 0);
    
    const grossProfit = profitableTrades.reduce((sum, t) => sum + t.profit, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));
    
    const totalPnl = allTrades.reduce((sum, t) => sum + t.profit, 0);
    const profitFactor = grossLoss === 0 ? grossProfit : parseFloat((grossProfit / grossLoss).toFixed(3));
    
    // Calculate Drawdown (simplified for this context)
    // In a real system, we'd iterate through history to find the max peak-to-trough
    let maxDD = currentStats.max_drawdown_usd || 0;
    let peak = currentStats.peak_equity || 0;
    const currentEquity = (currentStats.initial_balance || 0) + totalPnl;
    
    if (currentEquity > peak) {
      peak = currentEquity;
    }
    const currentDD = peak - currentEquity;
    if (currentDD > maxDD) {
      maxDD = currentDD;
    }

    await supabase.from('backtesting').update({
      total_trades: totalTrades,
      total_pnl_usd: totalPnl,
      profitable_trades_count: profitableTrades.length,
      profitable_trades_percent: Math.round((profitableTrades.length / totalTrades) * 100),
      profit_factor: profitFactor,
      max_drawdown_usd: maxDD,
      peak_equity: peak
    }).eq('id', 1);
  }

  revalidatePath('/');
  revalidatePath('/backtesting');
  revalidatePath('/admin');
}

export async function addSystemUpdate(update: any) {
  await checkAdmin();
  const { error } = await supabase
    .from('updates')
    .insert([update]);
  
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateBacktestingSummary(summary: any) {
  await checkAdmin();
  const { error } = await supabase
    .from('backtesting')
    .upsert({ id: 1, ...summary }); // Use upsert to create if missing
  
  if (error) throw error;
  revalidatePath('/backtesting');
  revalidatePath('/admin');
}

export async function updateHistoricalTrade(id: number, data: any) {
  await checkAdmin();
  const { error } = await supabase
    .from('trades')
    .update(data)
    .eq('id', id);
  
  if (error) throw error;
  await syncBacktestingStats();
  revalidatePath('/backtesting');
  revalidatePath('/admin');
}

export async function deleteHistoricalTrade(id: number) {
  await checkAdmin();
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  await syncBacktestingStats();
  revalidatePath('/backtesting');
  revalidatePath('/admin');
}

export async function syncBacktestingStats() {
  const { data: allTrades } = await supabase.from('trades').select('*').order('date', { ascending: true });
  const { data: currentStats } = await supabase.from('backtesting').select('*').eq('id', 1).maybeSingle();
  
  // If no trades, we still want to ensure a backtesting record exists
  if (!allTrades) return;

  const initialBalance = currentStats?.initial_balance || 1000000;
  const totalTrades = allTrades.length;
  const profitableTrades = allTrades.filter(t => t.profit > 0);
  const losingTrades = allTrades.filter(t => t.profit < 0);
  
  const grossProfit = profitableTrades.reduce((sum, t) => sum + t.profit, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));
  
  const totalPnl = allTrades.reduce((sum, t) => sum + t.profit, 0);
  const profitFactor = grossLoss === 0 ? grossProfit : parseFloat((grossProfit / grossLoss).toFixed(3));
  
  let maxDD = 0;
  let peak = initialBalance;
  let runningPnl = 0;

  for (const trade of allTrades) {
    runningPnl += trade.profit;
    const currentEquity = initialBalance + runningPnl;
    if (currentEquity > peak) {
      peak = currentEquity;
    }
    const currentDD = peak - currentEquity;
    if (currentDD > maxDD) {
      maxDD = currentDD;
    }
  }

  const upsertData = {
    id: 1,
    total_trades: totalTrades,
    total_pnl_usd: totalPnl,
    total_pnl_percent: parseFloat(((totalPnl / initialBalance) * 100).toFixed(2)),
    profitable_trades_count: profitableTrades.length,
    profitable_trades_percent: totalTrades > 0 ? Math.round((profitableTrades.length / totalTrades) * 100) : 0,
    profit_factor: profitFactor,
    max_drawdown_usd: maxDD,
    max_drawdown_percent: parseFloat(((maxDD / initialBalance) * 100).toFixed(2)),
    peak_equity: peak,
    initial_balance: initialBalance
  };

  const { error } = await supabase.from('backtesting').upsert(upsertData);
  if (error) console.error("Error syncing backtesting stats:", error);
}

export async function bulkInsertTrades(trades: any[]) {
  await checkAdmin();
  const { error } = await supabase
    .from('trades')
    .insert(trades);
  
  if (error) throw error;
  await syncBacktestingStats();
  revalidatePath('/backtesting');
  revalidatePath('/admin');
}

export async function clearAllTrades() {
  await checkAdmin();
  const { error } = await supabase
    .from('trades')
    .delete()
    .neq('id', 0); // Delete all rows
  
  if (error) throw error;
  await syncBacktestingStats();
  revalidatePath('/backtesting');
  revalidatePath('/admin');
}

export async function updateDashboardTrade(trade: {
  date: string;
  direction: string;
  entry: number;
  exit: number;
  profit: number;
  streak: number;
}) {
  await checkAdmin();
  const { error } = await supabase
    .from('dashboard_trade')
    .upsert({ id: 1, ...trade, updated_at: new Date().toISOString() });

  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin');
}
