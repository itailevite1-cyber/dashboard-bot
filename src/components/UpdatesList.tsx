"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Bell, X } from "lucide-react";

interface Update {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface UpdatesListProps {
  updates: Update[];
}

export default function UpdatesList({ updates }: UpdatesListProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Sorting logic (DD/MM/YYYY)
  const sortedUpdates = [...updates].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    return (
      new Date(yearB, monthB - 1, dayB).getTime() -
      new Date(yearA, monthA - 1, dayA).getTime()
    );
  });

  const displayUpdates = sortedUpdates.slice(0, 3);

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="text-zinc-400" size={20} />
        <h2 className="text-xl font-bold text-zinc-100">עדכונים</h2>
      </div>

      <div className="space-y-4">
        {displayUpdates.map((update, index) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition-colors hover:bg-zinc-900/60"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400 group-hover:bg-zinc-700">
                <Info size={20} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-100">{update.title}</h3>
                  <span className="text-xs text-zinc-500">{update.date}</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {update.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {sortedUpdates.length > 3 && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full py-3 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
          >
            ראה עוד
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-[60] w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl md:p-8"
              dir="rtl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="text-emerald-400" size={24} />
                  <h2 className="text-2xl font-bold text-zinc-100">
                    כל העדכונים
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {sortedUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400">
                        <Info size={20} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-zinc-100">
                            {update.title}
                          </h3>
                          <span className="text-xs text-zinc-500">
                            {update.date}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-400">
                          {update.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
