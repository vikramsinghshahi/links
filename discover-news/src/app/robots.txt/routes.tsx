export function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: https://YOUR-DOMAIN.com/sitemap.xml`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
