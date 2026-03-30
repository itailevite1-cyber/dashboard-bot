"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, ChevronLeft } from "lucide-react";
import FAQ from "./FAQ";

interface Guide {
  id: number;
  title: string;
  link: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SidebarGuidesProps {
  guides: Guide[];
  faqItems: FAQItem[];
}

export default function SidebarGuides({ guides, faqItems }: SidebarGuidesProps) {
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="text-zinc-400" size={20} />
          <h2 className="text-xl font-bold text-zinc-100 italic">מדריכים</h2>
        </div>

        <div className="space-y-3">
          {guides.map((guide, index) => (
            <motion.a
              key={guide.id}
              href={guide.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:border-emerald-500/50 hover:bg-zinc-900/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
                  <ExternalLink size={16} />
                </div>
                <span className="font-medium text-zinc-300 group-hover:text-zinc-100">{guide.title}</span>
              </div>
              <ChevronLeft size={16} className="text-zinc-500 transition-transform group-hover:-translate-x-1 group-hover:text-emerald-400" />
            </motion.a>
          ))}
        </div>
      </div>

      <FAQ items={faqItems} />
    </div>
  );
}
