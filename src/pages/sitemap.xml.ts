import type { APIRoute } from 'astro';
import { site } from '../data/seo';
import { caseStudies } from '../data/work';

export const GET: APIRoute = () => {
  const urls = [`${site}/`, ...caseStudies.map((c) => `${site}/work/${c.slug}/`)];
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
