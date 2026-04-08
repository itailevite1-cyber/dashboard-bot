import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import AdminContent from "./AdminContent";
import { ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import LoginRedirect from "@/components/LoginRedirect";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return <LoginRedirect />;
  }

  // Fetch initial data
  const { data: users } = await supabase.from('authorized_users').select('*').order('created_at', { ascending: false });
  const { data: trades } = await supabase.from('trades').select('*').order('date', { ascending: false });
  const { data: updates } = await supabase.from('updates').select('*').order('created_at', { ascending: false });

  return (
    <AdminContent 
      initialUsers={users || []} 
      initialTrades={trades || []} 
      initialUpdates={updates || []}
      userName={session.user.name || "אדמין"}
    />
  );
}
