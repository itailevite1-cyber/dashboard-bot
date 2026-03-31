import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      if (!user.email) return false;

      const { data, error } = await supabase
        .from('authorized_users')
        .select('email')
        .ilike('email', user.email)
        .single();

      if (error || !data) {
        console.log(`Unauthorized login attempt: ${user.email}`);
        return false;
      }

      return true;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user?.email) {
        const { data } = await supabase
          .from('authorized_users')
          .select('is_admin')
          .ilike('email', session.user.email)
          .single();
        
        session.user.isAdmin = data?.is_admin || false;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
