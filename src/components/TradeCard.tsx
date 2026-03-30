"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Calendar, ArrowRightLeft, Target, Trophy } from "lucide-react";

interface TradeProps {
  trade: {
    date: string;
    direction: string;
    entry: number;
    exit: number;
    profit: number;
    streak: number;
  };
}

export default function TradeCard({ trade }: TradeProps) {
  const isProfit = trade.profit > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl"
    >
      {/* Decorative Trading Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Rising Chart Line (SVG) */}
        <svg className="absolute bottom-0 left-0 h-full w-full text-emerald-500/20" preserveAspectRatio="none" viewBox="0 0 100 100">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            d="M 0 90 Q 20 85 30 70 T 50 60 T 70 40 T 100 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>

        {/* Floating Candlesticks */}
        <div className="absolute top-10 left-10 flex flex-col items-center">
          <div className="w-[1px] h-4 bg-emerald-500/40" />
          <div className="w-3 h-8 bg-emerald-500/40 rounded-sm" />
          <div className="w-[1px] h-4 bg-emerald-500/40" />
        </div>
        <div className="absolute top-24 left-24 flex flex-col items-center">
          <div className="w-[1px] h-3 bg-emerald-500/30" />
          <div className="w-3 h-6 bg-emerald-500/30 rounded-sm" />
          <div className="w-[1px] h-3 bg-emerald-500/30" />
        </div>
        <div className="absolute top-16 left-40 flex flex-col items-center">
          <div className="w-[1px] h-5 bg-emerald-500/20" />
          <div className="w-3 h-10 bg-emerald-500/20 rounded-sm" />
          <div className="w-[1px] h-5 bg-emerald-500/20" />
        </div>
      </div>

      {/* Background Glow */}
      <div 
        className={`absolute -right-20 -top-20 h-96 w-96 rounded-full blur-[120px] opacity-20 ${
          isProfit ? "bg-emerald-500" : "bg-rose-500"
        }`} 
      />

      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-zinc-100 italic tracking-tight">העסקה האחרונה</h2>
            <div className="h-1 w-12 bg-emerald-500 rounded-full" />
          </div>
          <div className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold tracking-wide uppercase ${
            isProfit ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}>
            {isProfit ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            <span>{trade.direction}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Calendar size={14} />
              <span>תאריך</span>
            </div>
            <p className="text-lg font-semibold text-zinc-100">{trade.date}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Target size={14} />
              <span>מחיר כניסה</span>
            </div>
            <p className="text-lg font-semibold text-zinc-100">{trade.entry.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <ArrowRightLeft size={14} />
              <span>מחיר יציאה</span>
            </div>
            <p className="text-lg font-semibold text-zinc-100">{trade.exit.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Trophy size={14} />
              <span>רצף עסקאות מנצחות</span>
            </div>
            <p className="text-lg font-semibold text-zinc-100">{trade.streak}</p>
          </div>

          <div className="col-span-2 space-y-1 md:col-span-1">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>רווח / הפסד יומי</span>
            </div>
            <p className={`text-3xl font-black ${isProfit ? "text-emerald-500" : "text-rose-500"}`}>
              {isProfit ? "+" : ""}{trade.profit.toLocaleString()}$
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
