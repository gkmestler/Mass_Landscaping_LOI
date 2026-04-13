import { next } from '@vercel/edge';

export const config = {
  matcher: '/((?!_vercel|favicon\\.ico|robots\\.txt).*)',
};

export default function middleware(request: Request): Response {
  const user = process.env.LOI_USER ?? '';
  const pass = process.env.LOI_PASSWORD ?? '';

  if (!user || !pass) {
    return new Response('Auth not configured', { status: 500 });
  }

  const auth = request.headers.get('authorization');
  const expected = 'Basic ' + btoa(`${user}:${pass}`);

  if (auth !== expected) {
    return new Response('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Mass Landscape LOI", charset="UTF-8"',
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
        'Referrer-Policy': 'no-referrer',
      },
    });
  }

  return next();
}
