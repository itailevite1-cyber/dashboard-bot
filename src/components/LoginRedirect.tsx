"use client";

import { signIn } from "next-auth/react";
import { ShieldCheck } from "lucide-react";

export default function LoginRedirect() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-950 text-zinc-100">
      <ShieldCheck size={64} className="mb-6 text-zinc-700" />
      <h1 className="mb-2 text-2xl font-bold">גישה מוגבלת</h1>
      <p className="mb-8 text-zinc-500 text-center max-w-md">אנא התחבר עם חשבון מורשה כדי לגשת לממשק הניהול של איתי טריידס.</p>
      <button 
        onClick={() => signIn("google")}
        className="rounded-xl bg-zinc-100 px-8 py-3 font-bold text-zinc-950 hover:bg-white transition-all shadow-lg text-lg"
      >
        התחבר עם Google
      </button>
    </div>
  );
}
