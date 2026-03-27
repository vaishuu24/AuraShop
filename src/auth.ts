import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: process.env.EMAIL_FROM ?? 'noreply@vexo.store',
    }),
  ],
  pages: {
    signIn: '/',         // redirect to homepage — sign-in handled by modal
    error: '/',
  },
  callbacks: {
    // Attach userId + role to session for easy access in components
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-expect-error role not in default type — extended below
        session.user.role = user.role ?? 'CUSTOMER';
      }
      return session;
    },
  },
});
