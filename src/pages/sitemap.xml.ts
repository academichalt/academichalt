import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const resources = await getCollection('resources');
  const siteUrl = 'https://www.academichalt.in';

  const staticPages = ['', '/resources', '/categories', '/exams', '/tags', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/dmca'];

  const exams = [...new Set(resources.map(r => r.data.exam))];
  const categories = [...new Set(resources.map(r => r.data.category))];
  const types = [...new Set(resources.map(r => r.data.resourceType))];
  const allTags: string[] = [];
  resources.forEach(r => r.data.tags.forEach((t: string) => allTags.push(t)));
  const tags = [...new Set(allTags)];

  const urls = [
    ...staticPages.map(p => `<url><loc>${siteUrl}${p}</loc><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`),
    ...resources.map(r => `<url><loc>${siteUrl}/resource/${r.id}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
    ...exams.map(e => `<url><loc>${siteUrl}/exam/${e.toLowerCase().replace(/ /g, '-')}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`),
    ...categories.map(c => `<url><loc>${siteUrl}/category/${c.toLowerCase().replace(/ /g, '-')}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`),
    ...types.map(t => `<url><loc>${siteUrl}/type/${t.toLowerCase().replace(/ /g, '-')}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`),
    ...tags.map(t => `<url><loc>${siteUrl}/tag/${t.toLowerCase().replace(/ /g, '-')}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
};
