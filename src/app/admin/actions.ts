"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    throw new Error("Unauthorized");
  }
}

export async function addAuthorizedUser(email: string) {
  await checkAdmin();
  const { error } = await supabase
    .from('authorized_users')
    .insert([{ email, is_admin: false }]);
  
  if (error) throw error;
  revalidatePath('/admin');
}

export async function removeAuthorizedUser(email: string) {
  await checkAdmin();
  const { error } = await supabase
    .from('authorized_users')
    .delete()
    .eq('email', email);
  
  if (error) throw error;
  revalidatePath('/admin');
}

export async function updateLatestTrade(trade: any) {
  await checkAdmin();
  const { error } = await supabase
    .from('trades')
    .insert([trade]); // Always insert new for history, dashboard picks latest
  
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function addSystemUpdate(update: any) {
  await checkAdmin();
  const { error } = await supabase
    .from('updates')
    .insert([update]);
  
  if (error) throw error;
  revalidatePath('/');
  revalidatePath('/admin');
}
