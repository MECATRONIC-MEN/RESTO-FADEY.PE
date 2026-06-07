/** IP y user-agent del visitante (Vercel / proxy). */
export function getClientRequestContext(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;
  return { ip, userAgent };
}
