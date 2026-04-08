"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { UserPlus, Trash2, TrendingUp, Bell, CheckCircle2, BarChart3, Edit2, Plus, Copy, LayoutGrid } from "lucide-react";
import { addAuthorizedUser, removeAuthorizedUser, updateLatestTrade, addSystemUpdate, updateBacktestingSummary, updateHistoricalTrade, deleteHistoricalTrade, bulkInsertTrades, clearAllTrades, updateDashboardTrade } from "./actions";

interface AdminContentProps {
  initialUsers: any[];
  initialTrades: any[];
  initialUpdates: any[];
  userName: string;
}

function DashboardTradeManager({ onActionDone }: { onActionDone: (m: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState({
    date: "07.04",
    direction: "Short",
    entry: "24249",
    exit: "24199",
    profit: "1248",
    streak: "3"
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDashboardTrade({
        date: trade.date,
        direction: trade.direction,
        entry: parseFloat(trade.entry),
        exit: parseFloat(trade.exit),
        profit: parseFloat(trade.profit),
        streak: parseInt(trade.streak)
      });
      onActionDone("עסקת דשבורד עודכנה בהצלחה");
    } catch (e) {
      alert("שגיאה בעדכון");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-black mb-8 text-zinc-100 flex items-center gap-3 italic">
        <LayoutGrid size={24} className="text-emerald-500" />
        ניהול עסקת דף הבית (ידני)
      </h2>
      <p className="text-zinc-500 mb-8 text-sm font-medium">כאן ניתן להזין את העסקה "האחרונה" שמופיעה בדף הבית. היא לא תשפיע על המדדים של הבקטסטינג.</p>
      
      <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">תאריך</label>
          <input type="text" value={trade.date} onChange={(e) => setTrade({...trade, date: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">כיוון</label>
          <select value={trade.direction} onChange={(e) => setTrade({...trade, direction: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50">
            <option value="Long">Long (לונג)</option>
            <option value="Short">Short (שורט)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">מחיר כניסה</label>
          <input type="text" value={trade.entry} onChange={(e) => setTrade({...trade, entry: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">מחיר יציאה</label>
          <input type="text" value={trade.exit} onChange={(e) => setTrade({...trade, exit: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">רווח ($)</label>
          <input type="text" value={trade.profit} onChange={(e) => setTrade({...trade, profit: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">Streak (רצף)</label>
          <input type="text" value={trade.streak} onChange={(e) => setTrade({...trade, streak: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="col-span-2 mt-4 rounded-2xl bg-emerald-600 py-4 font-black text-white hover:bg-emerald-500 transition-all disabled:opacity-50 shadow-xl shadow-emerald-500/10"
        >
          {loading ? "מעדכן..." : "עדכן עסקה בדף הבית"}
        </button>
      </form>
    </div>
  );
}

export default function AdminContent({ initialUsers, initialTrades, initialUpdates, userName }: AdminContentProps) {
  const [activeTab, setActiveTab] = useState<"users" | "trades" | "updates" | "backtesting" | "dashboard">("users");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      {message && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-zinc-950 px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} /> {message}
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-zinc-100">ממשק אדמין - איתי טריידס</h1>
            <p className="text-zinc-500">שלום, {userName} (מנהל מערכת)</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">חזרה לדשבורד</a>
            <button 
              onClick={() => signOut()}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-2.5 text-sm font-bold hover:bg-zinc-800 transition-colors"
            >
              התנתק
            </button>
          </div>
        </header>

        <div className="mb-8 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {[
            { id: "users", label: "משתמשים מורשים", icon: UserPlus },
            { id: "trades", label: "עסקאות", icon: TrendingUp },
            { id: "backtesting", label: "בקטסטינג", icon: BarChart3 },
            { id: "dashboard", label: "דף בית", icon: LayoutGrid },
            { id: "updates", label: "עדכונים", icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 whitespace-nowrap rounded-2xl px-8 py-4 font-black transition-all ${
                activeTab === tab.id 
                  ? "bg-zinc-100 text-zinc-950 shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                  : "bg-zinc-900/50 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 border border-zinc-800/50"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-[40px] border border-zinc-800 bg-zinc-900/20 p-6 md:p-12 backdrop-blur-xl">
          {activeTab === "users" && <UsersManager users={initialUsers} onActionDone={showMessage} />}
          {activeTab === "trades" && <TradesManager trades={initialTrades} onActionDone={showMessage} />}
          {activeTab === "updates" && <UpdatesManager updates={initialUpdates} onActionDone={showMessage} />}
          {activeTab === "backtesting" && <BacktestingManager onActionDone={showMessage} />}
          {activeTab === "dashboard" && <DashboardTradeManager onActionDone={showMessage} />}
        </div>
      </div>
    </div>
  );
}

function UsersManager({ users, onActionDone }: { users: any[], onActionDone: (m: string) => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await addAuthorizedUser(email);
      setEmail("");
      onActionDone("משתמש נוסף בהצלחה");
    } catch (e) {
      alert("שגיאה בהוספת משתמש");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (email: string) => {
    if (!confirm(`למחוק את המשתמש ${email}?`)) return;
    try {
      await removeAuthorizedUser(email);
      onActionDone("משתמש הוסר");
    } catch (e) {
      alert("שגיאה בהסרת משתמש");
    }
  };

  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-black mb-6 text-zinc-100">הוספת משתמש מורשה</h2>
        <div className="flex gap-4">
          <input 
            type="email" 
            placeholder="example@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100/20 transition-all font-medium"
          />
          <button 
            onClick={handleAdd}
            disabled={loading}
            className="rounded-2xl bg-zinc-100 px-10 py-4 font-black text-zinc-950 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? "מוסיף..." : "הוסף"}
          </button>
        </div>
      </div>
      
      <div className="rounded-[32px] border border-zinc-800 bg-zinc-900/30 overflow-hidden backdrop-blur-md">
        <table className="w-full text-right">
          <thead className="bg-zinc-900/80 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-8">
            <tr>
              <th className="px-8 py-5">אימייל</th>
              <th className="px-8 py-5 text-left">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => (
              <tr key={user.email} className="hover:bg-zinc-100/5 transition-colors group">
                <td className="px-8 py-6 font-bold text-zinc-300">{user.email} {user.is_admin && <span className="mr-2 text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">Admin</span>}</td>
                <td className="px-8 py-6 text-left">
                  {!user.is_admin && (
                    <button 
                      onClick={() => handleRemove(user.email)}
                      className="text-zinc-700 hover:text-red-500 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TradesManager({ trades, onActionDone }: { trades: any[], onActionDone: (m: string) => void }) {
  const [isDual, setIsDual] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tradeA, setTradeA] = useState({ date: new Date().toISOString().split('T')[0], direction: "Long", entry: "", exit: "", profit: "" });
  const [tradeB, setTradeB] = useState({ date: new Date().toISOString().split('T')[0], direction: "Long", entry: "", exit: "", profit: "" });
  const [bulkData, setBulkData] = useState("");
  const [importing, setImporting] = useState(false);
  const [editingTrade, setEditingTrade] = useState<any>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateLatestTrade({ ...tradeA, profit: parseFloat(tradeA.profit) });
      if (isDual) {
        await updateLatestTrade({ ...tradeB, profit: parseFloat(tradeB.profit) });
      }
      onActionDone("העסקה עודכנה בהצלחה");
    } catch (e) {
      alert("שגיאה בעדכון");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkData) return;
    setImporting(true);
    try {
      const tradesToImport = JSON.parse(bulkData);
      await bulkInsertTrades(tradesToImport);
      setBulkData("");
      onActionDone(`${tradesToImport.length} עסקאות יובאו בהצלחה`);
    } catch (e) {
      alert("שגיאה בייבוא: וודא שהפורמט תקין (JSON)");
    } finally {
      setImporting(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("אזהרה: פעולה זו תמחק את כל היסטוריית העסקאות לצמיתות. האם אתה בטוח?")) return;
    setLoading(true);
    try {
      await clearAllTrades();
      onActionDone("כל העסקאות נמחקו");
    } catch (e) {
      alert("שגיאה במחיקת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("בטוח שברצונך למחוק?")) return;
    try {
      await deleteHistoricalTrade(id);
      onActionDone("העסקה נמחקה");
    } catch (e) {
      alert("שגיאה במחיקה");
    }
  };

  return (
    <div className="space-y-12">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-zinc-100 flex items-center gap-3 italic">
            <TrendingUp className="text-emerald-500" />
            ניהול עסקאות
          </h2>
          <button 
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all ml-auto ml-4"
          >
            <Trash2 size={14} />
            מחק הכל
          </button>
          <button 
            type="button"
            onClick={() => setIsDual(!isDual)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDual ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}
          >
            {isDual ? <Copy size={14} /> : <Plus size={14} />}
            {isDual ? "מצב הזנה כפולה פעיל" : "עבור להזנה כפולה"}
          </button>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-8 mb-16 bg-zinc-900/10 p-8 rounded-3xl border border-zinc-900">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">{isDual ? "עסקה א'" : "פרטי העסקה"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input type="date" value={tradeA.date} onChange={e => setTradeA({...tradeA, date: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-emerald-500/50 outline-none" />
              <select value={tradeA.direction} onChange={e => setTradeA({...tradeA, direction: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-emerald-500/50 outline-none font-bold">
                <option>Long</option>
                <option>Short</option>
              </select>
              <input placeholder="מחיר כניסה" type="text" value={tradeA.entry} onChange={e => setTradeA({...tradeA, entry: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-emerald-500/50 outline-none" />
              <input placeholder="מחיר יציאה" type="text" value={tradeA.exit} onChange={e => setTradeA({...tradeA, exit: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-emerald-500/50 outline-none" />
              <input placeholder="רווח ($)" type="text" value={tradeA.profit} onChange={e => setTradeA({...tradeA, profit: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-emerald-500/50 outline-none" />
            </div>
          </div>

          {isDual && (
            <div className="space-y-6 pt-8 border-t border-zinc-800/50">
              <h3 className="text-sm font-black text-violet-500 uppercase tracking-widest">עסקה ב' (כניסה שנייה)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input type="date" value={tradeB.date} onChange={e => setTradeB({...tradeB, date: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-violet-500/50 outline-none" />
                <select value={tradeB.direction} onChange={e => setTradeB({...tradeB, direction: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-violet-500/50 outline-none font-bold">
                  <option>Long</option>
                  <option>Short</option>
                </select>
                <input placeholder="מחיר כניסה" type="text" value={tradeB.entry} onChange={e => setTradeB({...tradeB, entry: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-violet-500/50 outline-none" />
                <input placeholder="מחיר יציאה" type="text" value={tradeB.exit} onChange={e => setTradeB({...tradeB, exit: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-violet-500/50 outline-none" />
                <input placeholder="רווח ($)" type="text" value={tradeB.profit} onChange={e => setTradeB({...tradeB, profit: e.target.value})} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-violet-500/50 outline-none" />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-emerald-600 py-4 font-black text-white hover:bg-emerald-500 transition-all disabled:opacity-50 shadow-xl shadow-emerald-500/10 active:scale-[0.99]">
            {loading ? "מעדכן..." : isDual ? "שמור את שתי העסקאות" : "עדכן עסקה יומית"}
          </button>
        </form>

        <div className="mb-16 space-y-6 bg-zinc-900/10 p-8 rounded-3xl border border-dashed border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-100">ייבוא מסיבי (Bulk Import)</h3>
              <p className="text-xs text-zinc-500 mt-1">הדבק כאן רשימת עסקאות בפורמט JSON כדי להעלות הכל בבת אחת</p>
            </div>
            <button 
              onClick={handleBulkImport}
              disabled={importing || !bulkData}
              className="px-6 py-2 rounded-xl bg-violet-600 text-white text-xs font-black hover:bg-violet-500 disabled:opacity-50 transition-all"
            >
              {importing ? "מייבא..." : "התחל ייבוא"}
            </button>
          </div>
          <textarea 
            rows={5}
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder='[ { "date": "2026-04-08", "direction": "Long", "entry": 24500, "exit": 24600, "profit": 400 }, ... ]'
            className="w-full rounded-2xl border border-zinc-800 bg-black/40 px-6 py-4 text-zinc-300 font-mono text-xs focus:ring-1 focus:ring-violet-500 outline-none resize-none"
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-zinc-100">היסטוריית עסקאות מלאה</h3>
          <div className="overflow-x-auto rounded-3xl border border-zinc-900 bg-zinc-950/20">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-900">
                <tr>
                  <th className="px-6 py-5 text-right">פעולות</th>
                  <th className="px-6 py-5 text-right">רווח ($)</th>
                  <th className="px-6 py-5 text-right">כניסה / יציאה</th>
                  <th className="px-6 py-5 text-right">סוג</th>
                  <th className="px-6 py-5 text-right">תאריך</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {trades.map((trade) => {
                  const dateObj = new Date(trade.date || trade.created_at);
                  const directionHebrew = trade.direction === 'Long' ? 'לונג' : 'שורט';
                  
                  return (
                    <tr key={trade.id} className="group hover:bg-zinc-900/20">
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 text-zinc-800">
                          <button onClick={() => setEditingTrade(trade)} className="p-2 hover:text-zinc-100 transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(trade.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                      <td className={`px-6 py-5 text-sm font-black text-right ${trade.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trade.profit >= 0 ? '+' : ''}{trade.profit?.toLocaleString()}$
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-zinc-500 italic text-right">{trade.entry?.toLocaleString()} / {trade.exit?.toLocaleString()}</td>
                      <td className="px-6 py-5 text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${trade.direction === 'Long' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {directionHebrew}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-zinc-400 text-right">
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
      </div>
      {editingTrade && <EditTradeModal trade={editingTrade} onClose={() => setEditingTrade(null)} onActionDone={onActionDone} />}
    </div>
  );
}

function EditTradeModal({ trade, onClose, onActionDone }: { trade: any, onClose: () => void, onActionDone: (m: string) => void }) {
  const [formData, setFormData] = useState({ ...trade });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateHistoricalTrade(trade.id, {
        ...formData,
        entry: parseFloat(formData.entry),
        exit: parseFloat(formData.exit),
        profit: parseFloat(formData.profit)
      });
      onActionDone("העסקה עודכנה");
      onClose();
    } catch (e) {
      alert("שגיאה בעדכון");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl rounded-[40px] border border-zinc-800 bg-zinc-950 p-8 md:p-12 shadow-2xl">
        <h3 className="text-2xl font-black text-zinc-100 mb-8 flex items-center gap-3 italic">
          <Edit2 className="text-violet-500" />
          עריכת עסקה
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-right" dir="rtl">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">תאריך</label>
              <input type="date" value={formData.date?.split('T')[0]} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">כיוון</label>
              <select value={formData.direction} onChange={e => setFormData({...formData, direction: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 font-bold">
                <option>Long</option>
                <option>Short</option>
              </select>
            </div>
            <div className="space-y-2 text-right">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">כניסה</label>
              <input type="text" value={formData.entry} onChange={e => setFormData({...formData, entry: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100" />
            </div>
             <div className="space-y-2 text-right">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">יציאה</label>
              <input type="text" value={formData.exit} onChange={e => setFormData({...formData, exit: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100" />
            </div>
            <div className="col-span-2 space-y-2 text-right">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">רווח ($)</label>
              <input type="text" value={formData.profit} onChange={e => setFormData({...formData, profit: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 font-black" />
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
             <button type="submit" disabled={loading} className="flex-1 rounded-2xl bg-zinc-100 py-4 font-black text-zinc-950 hover:bg-white transition-all disabled:opacity-50">
              {loading ? "מעדכן..." : "שמור שינויים"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4 text-sm font-bold text-zinc-400 hover:text-zinc-100 transition-all">
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UpdatesManager({ updates, onActionDone }: { updates: any[], onActionDone: (m: string) => void }) {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    setLoading(true);
    try {
      await addSystemUpdate({
        ...formData,
        date: new Date().toLocaleDateString('he-IL')
      });
      setFormData({ title: "", content: "" });
      onActionDone("עדכון פורסם");
    } catch (e) {
      alert("שגיאה בפרסום עדכון");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-black text-zinc-100">הוספת עדכון מערכת</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-4">כותרת העדכון</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100/20 transition-all font-bold" 
            required
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-4">תוכן העדכון</label>
          <textarea 
            rows={5} 
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100/20 transition-all font-medium resize-none" 
            required
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-emerald-500 py-5 text-lg font-black text-zinc-950 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.99]"
        >
          {loading ? "מפרסם..." : "פרסם עדכון לקהילה"}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">עדכונים קודמים</h3>
        <div className="grid gap-4">
          {updates.map((u) => (
            <div key={u.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 flex justify-between items-center group">
              <div>
                <h4 className="font-bold text-zinc-100">{u.title}</h4>
                <p className="text-xs text-zinc-500">{u.date}</p>
              </div>
              <button className="text-zinc-800 group-hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BacktestingManager({ onActionDone }: { onActionDone: (m: string) => void }) {
  const [summary, setSummary] = useState({
    total_pnl_usd: "13716",
    total_pnl_percent: "1.37",
    max_drawdown_usd: "2104",
    max_drawdown_percent: "0.21",
    total_trades: "64",
    profitable_trades_percent: "50",
    profitable_trades_count: "32",
    profit_factor: "2.729",
    initial_balance: "1000000"
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateBacktestingSummary({
        total_pnl_usd: parseFloat(summary.total_pnl_usd),
        total_pnl_percent: parseFloat(summary.total_pnl_percent),
        max_drawdown_usd: parseFloat(summary.max_drawdown_usd),
        max_drawdown_percent: parseFloat(summary.max_drawdown_percent),
        total_trades: parseInt(summary.total_trades),
        profitable_trades_percent: parseFloat(summary.profitable_trades_percent),
        profitable_trades_count: parseInt(summary.profitable_trades_count),
        profit_factor: parseFloat(summary.profit_factor),
        initial_balance: parseFloat(summary.initial_balance)
      });
      onActionDone("מדדי בקטסטינג עודכנו");
    } catch (e) {
      alert("שגיאה בעדכון מדדים");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-black mb-8 text-zinc-100 flex items-center gap-3 italic">
          <BarChart3 size={24} className="text-violet-500" />
          ניהול מערכת בקטסטינג
        </h2>
        
        <form onSubmit={handleUpdateSummary} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">Total P&L (USD)</label>
              <input 
                type="text" 
                value={summary.total_pnl_usd}
                onChange={(e) => setSummary({...summary, total_pnl_usd: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">Total P&L (%)</label>
              <input 
                type="text" 
                value={summary.total_pnl_percent}
                onChange={(e) => setSummary({...summary, total_pnl_percent: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">Max DD (USD)</label>
              <input 
                type="text" 
                value={summary.max_drawdown_usd}
                onChange={(e) => setSummary({...summary, max_drawdown_usd: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">Max DD (%)</label>
              <input 
                type="text" 
                value={summary.max_drawdown_percent}
                onChange={(e) => setSummary({...summary, max_drawdown_percent: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50" 
              />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">Total Trades</label>
              <input 
                type="text" 
                value={summary.total_trades}
                onChange={(e) => setSummary({...summary, total_trades: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50" 
              />
            </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">Win Rate (%)</label>
              <input 
                type="text" 
                value={summary.profitable_trades_percent}
                onChange={(e) => setSummary({...summary, profitable_trades_percent: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">Profit Factor</label>
              <input 
                type="text" 
                value={summary.profit_factor}
                onChange={(e) => setSummary({...summary, profit_factor: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-violet-500 uppercase tracking-widest mr-2 font-black italic">Initial Balance ($)</label>
              <input 
                type="text" 
                value={summary.initial_balance}
                onChange={(e) => setSummary({...summary, initial_balance: e.target.value})}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500 font-black" 
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-zinc-100 py-5 text-lg font-black text-zinc-950 hover:bg-white transition-all shadow-xl shadow-zinc-100/10 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "מעדכן..." : "שמור שינויים בנתוני בקטסטינג"}
          </button>
        </form>

        <div className="mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-100">היסטוריית עסקאות בקטסטינג</h3>
            <button className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-bold hover:bg-zinc-700 transition-colors">הוסף נקודת נתונים</button>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 text-center border-dashed">
            <p className="text-sm text-zinc-500 italic uppercase tracking-widest font-black opacity-40">כאן תוכל לנהל את העסקאות ההיסטוריות שמרכיבות את הגרף</p>
          </div>
        </div>
      </div>
    </div>
  );
}

