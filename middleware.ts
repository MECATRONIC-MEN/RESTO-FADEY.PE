import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (pathname.startsWith('/dashboard/admin')) {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }

  if (pathname === '/login' && isLoggedIn) {
    if (role === 'master_admin') {
      return NextResponse.redirect(new URL('/admin', nextUrl));
    }
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const login = new URL('/login', nextUrl);
      login.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(login);
    }
    if (role !== 'master_admin') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      const login = new URL('/login', nextUrl);
      login.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(login);
    }
    const allowed = ['master_admin', 'cliente', 'observador'];
    if (!role || !allowed.includes(role)) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
};
