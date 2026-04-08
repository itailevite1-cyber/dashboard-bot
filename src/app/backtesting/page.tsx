"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, LayoutGrid, List } from "lucide-react";
import BacktestingMetrics from "@/components/BacktestingMetrics";
import EquityChart from "@/components/EquityChart";

export default function BacktestingPage() {
  const [activeTab, setActiveTab] = useState<"metrics" | "trades">("metrics");
  const [stats, setStats] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: statsData } = await supabase.from('backtesting').select('*').eq('id', 1).single();
      const { data: tradesData } = await supabase.from('trades').select('*').order('date', { ascending: false });

      setStats(statsData || {
        total_pnl_usd: 13716,
        total_pnl_percent: 1.37,
        max_drawdown_usd: 2104,
        max_drawdown_percent: 0.21,
        total_trades: 64,
        profitable_trades_percent: 50,
        profitable_trades_count: 32,
        profit_factor: 2.729
      });
      setTrades(tradesData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-zinc-100 selection:bg-violet-500/30">
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        {/* Navigation & Toolbar */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black italic tracking-tighter text-zinc-100 flex items-center gap-2">
              Itay Trades Bot
              <span className="text-zinc-700">|</span>
              <span className="text-sm font-bold text-zinc-500 not-italic">Backtesting System</span>
            </h1>
            <div className="flex h-fit bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
              <button 
                onClick={() => setActiveTab("metrics")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "metrics" ? "bg-zinc-100 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <LayoutGrid size={14} />
                Metrics
              </button>
              <button 
                onClick={() => setActiveTab("trades")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "trades" ? "bg-zinc-100 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <List size={14} />
                List of trades
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-xs font-bold text-zinc-400">
              <Calendar size={14} />
              Jan 1, {new Date().getFullYear()} — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <Link 
              href="/" 
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold hover:bg-zinc-800 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {activeTab === "metrics" ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Top Metrics Row */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-xl">
              <BacktestingMetrics data={stats} />
            </div>

            {/* Main Chart Area */}
            <EquityChart trades={trades} />

          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold">היסטוריית עסקאות</h2>
                <div className="text-xs text-zinc-500 font-medium">מציג {trades.length} עסקאות סה"כ</div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-900 text-right">
                    <tr>
                      <th className="pb-4 text-right pr-6">רווח ($)</th>
                      <th className="pb-4 text-right pr-6">מחיר</th>
                      <th className="pb-4 text-right pr-6">סוג</th>
                      <th className="pb-4 text-right pr-6">תאריך</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {trades.map((trade, i) => {
                      const dateObj = new Date(trade.date || trade.created_at);
                      const directionHebrew = trade.direction === 'Long' ? 'לונג' : 'שורט';
                      
                      return (
                        <tr key={i} className="group hover:bg-zinc-900/10 transition-colors">
                          <td className={`py-5 text-sm font-black text-right pr-6 ${trade.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trade.profit >= 0 ? '+' : ''}{trade.profit?.toLocaleString()}$
                          </td>
                          <td className="py-5 text-sm font-bold pr-6 text-right text-zinc-300">{trade.entry?.toLocaleString()}</td>
                          <td className="py-5 pr-6 text-right">
                            <span className={`text-[10px] px-3 py-1 rounded-full font-black ${trade.direction === 'Long' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                              {directionHebrew}
                            </span>
                          </td>
                          <td className="py-5 text-sm font-bold text-zinc-400 pr-6 text-right">
                            <div className="flex flex-col items-end">
                              <span>{dateObj.toLocaleDateString('he-IL')}</span>
                              <span className="text-[10px] text-zinc-600 font-medium">
                                {dateObj.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </main>
  );
}
