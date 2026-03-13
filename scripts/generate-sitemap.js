#!/usr/bin/env node
// Academic Halt - Automatic Sitemap Generator
// Generates sitemap.xml for all pages

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const BASE_URL = 'https://www.academichalt.com';
const today = new Date().toISOString().split('T')[0];

// Load data
const resources = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'data/resources.json'), 'utf8')).resources;
const clusters = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'data/clusters.json'), 'utf8')).clusters;

let blogIndex = { posts: [] };
try {
  blogIndex = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'data/blog-index.json'), 'utf8'));
} catch(e) {}

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/study-material/', priority: '0.9', changefreq: 'daily' },
  { url: '/notes/', priority: '0.9', changefreq: 'daily' },
  { url: '/books/', priority: '0.9', changefreq: 'daily' },
  { url: '/videos/', priority: '0.8', changefreq: 'weekly' },
  { url: '/question-papers/', priority: '0.9', changefreq: 'daily' },
  { url: '/mock-tests/', priority: '0.8', changefreq: 'daily' },
  { url: '/blog/', priority: '0.9', changefreq: 'daily' },
  { url: '/about.html', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact.html', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy-policy.html', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms.html', priority: '0.3', changefreq: 'yearly' },
  { url: '/disclaimer.html', priority: '0.3', changefreq: 'yearly' },
  { url: '/tools/', priority: '0.7', changefreq: 'monthly' },
  { url: '/tools/pomodoro-timer/', priority: '0.6', changefreq: 'monthly' },
  { url: '/tools/gpa-calculator/', priority: '0.6', changefreq: 'monthly' },
  { url: '/tools/exam-countdown/', priority: '0.6', changefreq: 'monthly' },
  { url: '/tools/quiz-generator/', priority: '0.6', changefreq: 'monthly' },
  { url: '/tools/flashcard-generator/', priority: '0.6', changefreq: 'monthly' },
  { url: '/tools/percentage-calculator/', priority: '0.6', changefreq: 'monthly' },
  { url: '/tools/word-counter/', priority: '0.6', changefreq: 'monthly' },
  { url: '/search.html', priority: '0.6', changefreq: 'weekly' },
];

// SEO cluster pages
const clusterPages = clusters.map(c => ({
  url: c.pageUrl,
  priority: '0.8',
  changefreq: 'weekly',
}));

// High-value keyword pages
const kwPages = [
  '/class-12-chemistry-notes-pdf/', '/upsc-polity-notes-pdf/', '/jee-physics-notes-pdf/',
  '/neet-biology-notes-pdf/', '/ssc-cgl-notes-pdf/', '/gate-cs-notes-pdf/',
  '/class-10-science-notes-pdf/', '/upsc-history-notes-pdf/', '/jee-chemistry-notes-pdf/',
  '/ibps-po-notes-pdf/', '/class-12-physics-notes-pdf/', '/neet-chemistry-notes-pdf/',
  '/upsc-geography-notes-pdf/', '/ssc-english-notes-pdf/', '/class-12-maths-notes-pdf/',
].map(url => ({ url, priority: '0.8', changefreq: 'weekly' }));

function urlEntry({ url, priority = '0.6', changefreq = 'weekly', lastmod = today }) {
  return `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

console.log('🗺️  Generating sitemap.xml...\n');

const entries = [];

// Add static pages
entries.push('  <!-- Static Pages -->');
staticPages.forEach(p => entries.push(urlEntry(p)));

// Add SEO cluster pages
entries.push('\n  <!-- Exam Category Pages -->');
clusterPages.forEach(p => entries.push(urlEntry(p)));

// Add keyword pages
entries.push('\n  <!-- High-Value SEO Pages -->');
kwPages.forEach(p => entries.push(urlEntry(p)));

// Add resource pages
entries.push('\n  <!-- Resource Pages -->');
resources.forEach(r => {
  entries.push(urlEntry({
    url: `/${r.slug}/`,
    priority: r.featured ? '0.8' : '0.6',
    changefreq: 'monthly',
    lastmod: r.dateAdded || today,
  }));
});

// Add blog posts
entries.push('\n  <!-- Blog Posts -->');
blogIndex.posts.forEach(post => {
  entries.push(urlEntry({
    url: `/blog/${post.slug}/`,
    priority: '0.6',
    changefreq: 'monthly',
  }));
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${entries.join('\n')}

</urlset>`;

fs.writeFileSync(path.join(BASE_DIR, 'sitemap.xml'), sitemap);

const totalUrls = staticPages.length + clusterPages.length + kwPages.length + resources.length + blogIndex.posts.length;
console.log(`✅ Sitemap generated with ${totalUrls.toLocaleString()} URLs`);
console.log(`   - Static pages: ${staticPages.length}`);
console.log(`   - SEO cluster pages: ${clusterPages.length}`);
console.log(`   - Keyword landing pages: ${kwPages.length}`);
console.log(`   - Resource pages: ${resources.length.toLocaleString()}`);
console.log(`   - Blog posts: ${blogIndex.posts.length.toLocaleString()}`);
console.log(`\n📁 Saved to sitemap.xml`);

// Also generate sitemap index if very large
if (totalUrls > 50000) {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-resources.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
  fs.writeFileSync(path.join(BASE_DIR, 'sitemap-index.xml'), sitemapIndex);
  console.log(`📋 Sitemap index saved to sitemap-index.xml`);
}
