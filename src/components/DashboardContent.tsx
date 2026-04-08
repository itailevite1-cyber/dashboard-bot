"use client";

import TradeCard from "@/components/TradeCard";
import UpdatesList from "@/components/UpdatesList";
import SidebarGuides from "@/components/SidebarGuides";
import ChecklistModal from "@/components/ChecklistModal";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface DashboardContentProps {
  latestTrade: any;
  updates: any[];
  guideCategories: any[];
  faqData: any[];
}

export default function DashboardContent({ latestTrade, updates, guideCategories, faqData }: DashboardContentProps) {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [activeChecklistTitle, setActiveChecklistTitle] = useState("");

  const handleChecklistClick = (title: string) => {
    setActiveChecklistTitle(title);
    setIsChecklistOpen(true);
  };

  return (
    <main className="relative mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:py-12">
      {/* Header */}
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-zinc-900 ring-1 ring-zinc-800">
            <Image 
              src="https://res.cloudinary.com/dmcrp2soa/image/upload/v1774369565/ITAY_TRADES_1_i8biyw.png"
              alt="Itay Trades Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-100 md:text-3xl italic">איתי טריידס בוט</h1>
            <p className="text-sm text-zinc-500">דשבורד מעקב וביצועים בזמן אמת</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 md:flex">
          <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-500">הבוט מחובר ופעיל</span>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
        {/* Main Content (70%) */}
        <section className="space-y-8">
          <TradeCard trade={latestTrade} />
          
          {/* Backtesting Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/backtesting"
              className="group relative flex w-full items-center justify-between overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 p-1 hover:border-violet-500/50 transition-all duration-500"
            >
              <div className="flex items-center gap-6 px-8 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.4)] group-hover:scale-110 transition-transform duration-500">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-black italic text-zinc-100 italic tracking-tight">גישה למערכת בקטסטינג מלאה</h3>
                  <p className="text-sm text-zinc-500">ניתוח ביצועים היסטורי, סטטיסטיקות וצפי רווחיות</p>
                </div>
              </div>
              <div className="ml-8 hidden h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 group-hover:bg-violet-600 group-hover:border-violet-600 transition-all duration-500 sm:flex">
                <svg className="h-5 w-5 text-zinc-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l7-7-7-7" />
                </svg>
              </div>
              
              {/* Animated Glow Overlay */}
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Link>
          </motion.div>

          <UpdatesList updates={updates} />
        </section>

        {/* Sidebar (30%) */}
        <aside className="space-y-8 lg:sticky lg:top-8 lg:h-fit">
          <SidebarGuides 
            categories={guideCategories} 
            faqItems={faqData} 
            onChecklistClick={handleChecklistClick}
          />
        </aside>
      </div>

      <ChecklistModal 
        isOpen={isChecklistOpen} 
        onClose={() => setIsChecklistOpen(false)} 
        title={activeChecklistTitle}
      />

      {/* Footer */}
      <footer className="mt-24 border-t border-zinc-900/50 pt-8 pb-12">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-right">
          <p className="text-sm text-zinc-500">© 2026 איתי טריידס - כל הזכויות שמורות</p>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors underline underline-offset-4 decoration-zinc-800">תנאי שימוש</a>
            <a href="#" className="hover:text-zinc-300 transition-colors underline underline-offset-4 decoration-zinc-800">מדיניות פרטיות</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
