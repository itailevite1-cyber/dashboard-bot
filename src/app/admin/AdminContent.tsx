"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { UserPlus, Trash2, TrendingUp, Bell, CheckCircle2 } from "lucide-react";
import { addAuthorizedUser, removeAuthorizedUser, updateLatestTrade, addSystemUpdate } from "./actions";

interface AdminContentProps {
  initialUsers: any[];
  initialTrades: any[];
  initialUpdates: any[];
  userName: string;
}

export default function AdminContent({ initialUsers, initialTrades, initialUpdates, userName }: AdminContentProps) {
  const [activeTab, setActiveTab] = useState<"users" | "trades" | "updates">("users");
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
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    direction: "לונג",
    entry: "",
    exit: "",
    profit: "",
    streak: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateLatestTrade({
        ...formData,
        entry: parseFloat(formData.entry),
        exit: parseFloat(formData.exit),
        streak: parseInt(formData.streak),
        profit: parseFloat(formData.profit.replace('$', '').replace('+', ''))
      });
      onActionDone("עסקה עודכנה בהצלחה");
    } catch (e) {
      alert("שגיאה בעדכון העסקה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-black text-zinc-100">עדכון עסקה אחרונה</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-4">תאריך</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100/20 transition-all" 
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-4">כיוון</label>
            <select 
              value={formData.direction}
              onChange={(e) => setFormData({...formData, direction: e.target.value})}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100/20 transition-all font-bold appearance-none"
            >
              <option>לונג</option>
              <option>שורט</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-4">מחיר כניסה</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.entry}
              onChange={(e) => setFormData({...formData, entry: e.target.value})}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100/20 transition-all" 
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-4">מחיר יציאה</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.exit}
              onChange={(e) => setFormData({...formData, exit: e.target.value})}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100/20 transition-all" 
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-4">רווח / הפסד ($)</label>
            <input 
              type="text" 
              placeholder="+450"
              value={formData.profit}
              onChange={(e) => setFormData({...formData, profit: e.target.value})}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100/20 transition-all" 
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-4">רצף ניצחונות</label>
            <input 
              type="number" 
              value={formData.streak}
              onChange={(e) => setFormData({...formData, streak: e.target.value})}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-100/20 transition-all" 
              required
            />
          </div>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full mt-6 rounded-[32px] bg-zinc-100 py-6 text-xl font-black text-zinc-950 hover:bg-white transition-all shadow-2xl disabled:opacity-50 active:scale-[0.99] tracking-tighter"
        >
          {loading ? "מעדכן..." : "שמור ופרסם עסקה"}
        </button>
      </form>
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
