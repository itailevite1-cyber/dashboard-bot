import React from "react";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, ChevronLeft, FileText, Play, Check } from "lucide-react";
import FAQ from "./FAQ";
import { GuideCategory } from "@/data/mockData";

interface FAQItem {
  question: string;
  answer: string;
}

interface SidebarGuidesProps {
  categories: GuideCategory[];
  faqItems: FAQItem[];
  onChecklistClick: (title: string) => void;
}

export default function SidebarGuides({ categories, faqItems, onChecklistClick }: SidebarGuidesProps) {
  const handleGuideClick = (e: React.MouseEvent<HTMLAnchorElement>, type?: string, title?: string) => {
    if (type === "checklist") {
      e.preventDefault();
      onChecklistClick(title || "");
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="text-zinc-400" size={20} />
          <h2 className="text-xl font-bold text-zinc-100 italic">מדריכים</h2>
        </div>

        <div className="space-y-8">
          {categories.map((category, catIndex) => (
            <div key={category.title} className="space-y-4">
              {catIndex > 0 && <div className="h-px bg-zinc-800/50 w-full" />}
              
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500/80 bg-emerald-500/5 py-1.5 px-3 rounded-md w-fit">
                  {category.title}
                </h3>
                
                <div className="space-y-3">
                  {category.items.map((guide, index) => {
                    const isVideo = guide.type === "video";
                    const isChecklist = guide.type === "checklist";
                    
                    return (
                      <motion.a
                        key={guide.id}
                        href={guide.link}
                        target={isChecklist ? undefined : "_blank"}
                        rel={isChecklist ? undefined : "noopener noreferrer"}
                        onClick={(e) => handleGuideClick(e, guide.type, guide.title)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (catIndex * 3 + index) * 0.1 }}
                        className={`group flex items-center justify-between rounded-xl border p-4 transition-all ${
                          isVideo 
                            ? "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50 hover:bg-blue-500/10" 
                            : isChecklist
                            ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                            : "border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/50 hover:bg-zinc-900/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isVideo 
                              ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20" 
                              : isChecklist
                              ? "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20"
                              : "bg-zinc-800 text-zinc-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400"
                          }`}>
                            {isVideo ? <Play size={16} fill="currentColor" /> : isChecklist ? <Check size={16} strokeWidth={3} /> : <FileText size={16} />}
                          </div>
                          <span className="font-medium text-zinc-300 group-hover:text-zinc-100">{guide.title}</span>
                        </div>
                        <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-1 ${
                          isVideo ? "text-blue-500/50 group-hover:text-blue-400" : "text-zinc-500 group-hover:text-emerald-400"
                        }`} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FAQ items={faqItems} />
    </div>
  );
}
