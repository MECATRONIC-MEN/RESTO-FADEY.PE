import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { verifyUserPassword } from '@/lib/services/users';
import type { UserRole } from '@/lib/auth/types';

declare module 'next-auth' {
  interface User {
    role: UserRole;
    restaurant?: string | null;
    plan?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      restaurant?: string | null;
      plan?: string | null;
    };
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: UserRole;
    restaurant?: string | null;
    plan?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await verifyUserPassword(email, password);
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          restaurant: user.restaurant ?? null,
          plan: user.plan ?? null,
        };
      },
    }),
  ],
});
