import type { NextAuthConfig } from 'next-auth';
import type { UserRole } from '@/lib/auth/types';

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.clientId = user.clientId;
        token.restaurant = user.restaurant;
        token.plan = user.plan;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.clientId = (token.clientId as string | null) ?? null;
        session.user.restaurant = (token.restaurant as string | null) ?? null;
        session.user.plan = (token.plan as string | null) ?? null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
