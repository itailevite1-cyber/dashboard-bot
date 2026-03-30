"use client";

import { motion } from "framer-motion";
import { Info, Bell } from "lucide-react";

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
  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="text-zinc-400" size={20} />
        <h2 className="text-xl font-bold text-zinc-100">עדכונים</h2>
      </div>

      <div className="space-y-4">
        {updates.map((update, index) => (
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
                <p className="text-sm leading-relaxed text-zinc-400">{update.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
