import { allPosts } from '@/app/lib/posts';

export function GET() {
  const base = 'https://YOUR-DOMAIN.com';
  const urls = allPosts()
    .map(
      (p) =>
        `<url><loc>${base}/${p.slug}</loc><lastmod>${
          p.updatedAt || p.publishedAt
        }</lastmod></url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${base}</loc></url>
${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
