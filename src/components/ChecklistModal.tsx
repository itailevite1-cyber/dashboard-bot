"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Circle } from "lucide-react";

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const initialTasks: ChecklistItem[] = [
  { id: 1, text: "פתיחת משתמש טריידינג וויו ושליחת הכינוי לאיתי", checked: false },
  { id: 2, text: "קניית תיק נוסטרו באפקס", checked: false },
  { id: 3, text: "מנוי חודשי ומנוי CME", checked: false },
  { id: 4, text: "פתיחת חשבון פיק מיי טרייד", checked: false },
  { id: 5, text: "יצירת התראה בפיק מיי טרייד", checked: false },
  { id: 6, text: "לפתוח גרף על נכס MNQ1! חמש דקות", checked: false },
  { id: 7, text: "להוסיף אינדיקטור בוט לגרף", checked: false },
  { id: 8, text: "עדכון הגדרות הבוט בטריידינג וויו לפי פרטי חשבון אישיים", checked: false },
  { id: 9, text: "יצירת התראה בטריידינג וויו", checked: false },
  { id: 10, text: "התראה פועלת", checked: false },
];

export default function ChecklistModal({ isOpen, onClose, title }: ChecklistModalProps) {
  const [tasks, setTasks] = useState<ChecklistItem[]>(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, checked: !task.checked } : task
    ));
  };

  const progress = Math.round((tasks.filter(t => t.checked).length / tasks.length) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm flex flex-col max-h-[90vh] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 p-5 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{title}</h3>
                  <p className="text-[10px] text-zinc-500">וודא שביצעת את כל השלבים</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-5 pt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-medium text-zinc-400">התקדמות</span>
                <span className="text-[10px] font-bold text-emerald-500">{progress}%</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>

            {/* List - Scrollable */}
            <div className="p-5 space-y-2 overflow-y-auto custom-scrollbar">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-right transition-all border ${
                    task.checked 
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-100" 
                      : "bg-zinc-800/30 border-transparent text-zinc-300 hover:bg-zinc-800/50"
                  }`}
                >
                  {task.checked ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-zinc-600 shrink-0" />
                  )}
                  <span className={`text-[13px] font-medium leading-tight ${task.checked ? "line-through opacity-50" : ""}`}>
                    {task.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-800 p-5 bg-zinc-900/50">
              <button 
                onClick={onClose}
                className="w-full rounded-xl bg-zinc-100 py-2.5 text-xs font-bold text-zinc-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                סגור וסיים
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
