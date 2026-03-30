import { latestTrade, updates, guides, faqData } from "@/data/mockData";
import TradeCard from "@/components/TradeCard";
import UpdatesList from "@/components/UpdatesList";
import SidebarGuides from "@/components/SidebarGuides";
import { LayoutDashboard } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:py-12">
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
          <UpdatesList updates={updates} />
        </section>

        {/* Sidebar (30%) */}
        <aside className="space-y-8 lg:sticky lg:top-8 lg:h-fit">
          <SidebarGuides guides={guides} faqItems={faqData} />
        </aside>
      </div>

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
