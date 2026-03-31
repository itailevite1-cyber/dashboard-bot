"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-950">טוען...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto relative h-32 w-32 overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          <Image 
            src="https://res.cloudinary.com/dmcrp2soa/image/upload/v1774369565/ITAY_TRADES_1_i8biyw.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black italic tracking-tighter text-zinc-100 uppercase">כניסה למערכת</h1>
          <p className="text-zinc-500 font-medium">המערכת מאובטחת ומיועדת למשתמשים מורשים בלבד.</p>
        </div>

        <div className="mt-8">
          <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="group relative w-full flex items-center justify-center gap-4 rounded-2xl bg-zinc-100 px-8 py-5 text-lg font-black text-zinc-950 hover:bg-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-[0.98]"
          >
            <ShieldCheck className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
            התחבר עם Google
          </button>
        </div>

        <p className="mt-8 text-xs text-zinc-600">
          בעיה בהתחברות? צור קשר עם התמיכה
        </p>
      </div>
    </div>
  );
}
