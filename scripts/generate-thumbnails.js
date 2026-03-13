#!/usr/bin/env node
// Academic Halt - SVG Thumbnail Generator
// Generates SVG thumbnails for all resources

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const THUMB_DIR = path.join(BASE_DIR, 'assets/thumbnails');

fs.mkdirSync(THUMB_DIR, { recursive: true });

const resources = JSON.parse(
  fs.readFileSync(path.join(BASE_DIR, 'data/resources.json'), 'utf8')
).resources;

const categoryColors = {
  'Notes':          { bg: '#dbeafe', accent: '#2563eb', text: '#1d4ed8' },
  'Books':          { bg: '#dcfce7', accent: '#16a34a', text: '#15803d' },
  'Question Papers':{ bg: '#fef9c3', accent: '#ca8a04', text: '#854d0e' },
  'Mock Tests':     { bg: '#f3e8ff', accent: '#9333ea', text: '#7e22ce' },
  'Videos':         { bg: '#fee2e2', accent: '#dc2626', text: '#b91c1c' },
  'Study Guides':   { bg: '#cffafe', accent: '#0891b2', text: '#0e7490' },
};

const categoryIcons = {
  'Notes': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" fill="none"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/><polyline points="10 9 9 9 8 9" stroke="currentColor" stroke-width="2"/>`,
  'Books': `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="2" fill="none"/>`,
  'Question Papers': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="14" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 11V9" stroke="currentColor" stroke-width="2"/>`,
  'Mock Tests': `<polyline points="9 11 12 14 22 4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="2" fill="none"/>`,
  'Videos': `<polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" stroke-width="2" fill="currentColor"/>`,
  'Study Guides': `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="2" fill="none"/>`,
};

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.substring(0, max - 1) + '…';
}

function wrapText(text, maxCharsPerLine, maxLines = 3) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxCharsPerLine) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function generateSVG(resource) {
  const colors = categoryColors[resource.category] || categoryColors['Notes'];
  const icon = categoryIcons[resource.category] || categoryIcons['Notes'];
  const titleLines = wrapText(resource.title, 26, 3);
  const subjectShort = truncate(resource.subject || '', 20);
  const examShort = truncate(resource.exam || '', 18);

  const titleY = 118 + (3 - titleLines.length) * 10;

  return `<svg viewBox="0 0 280 157" xmlns="http://www.w3.org/2000/svg" width="280" height="157">
  <defs>
    <linearGradient id="bg-${resource.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${colors.bg};stop-opacity:0.6"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="280" height="157" fill="url(#bg-${resource.id})" rx="8"/>

  <!-- Pattern overlay -->
  <circle cx="240" cy="20" r="60" fill="${colors.accent}" opacity="0.06"/>
  <circle cx="20" cy="140" r="50" fill="${colors.accent}" opacity="0.05"/>

  <!-- Top bar -->
  <rect width="280" height="4" fill="${colors.accent}" rx="0" opacity="0.8"/>

  <!-- Icon circle -->
  <circle cx="34" cy="38" r="20" fill="${colors.accent}" opacity="0.15"/>
  <g transform="translate(22,26) scale(1)" color="${colors.accent}">
    <svg width="24" height="24" viewBox="0 0 24 24">${icon}</svg>
  </g>

  <!-- Category pill -->
  <rect x="62" y="28" width="${resource.category.length * 7 + 12}" height="20" rx="10" fill="${colors.accent}" opacity="0.15"/>
  <text x="${62 + (resource.category.length * 7 + 12) / 2}" y="42" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="700" fill="${colors.text}" letter-spacing="0.3">${resource.category.toUpperCase()}</text>

  <!-- Title -->
  ${titleLines.map((line, i) => `<text x="14" y="${titleY + i * 18}" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="#0f172a">${line}</text>`).join('\n  ')}

  <!-- Divider -->
  <line x1="14" y1="${titleY + titleLines.length * 18 + 6}" x2="266" y2="${titleY + titleLines.length * 18 + 6}" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Subject + Exam tags -->
  <rect x="14" y="${titleY + titleLines.length * 18 + 14}" width="${subjectShort.length * 6.5 + 16}" height="16" rx="8" fill="${colors.accent}" opacity="0.12"/>
  <text x="${14 + (subjectShort.length * 6.5 + 16) / 2}" y="${titleY + titleLines.length * 18 + 26}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="600" fill="${colors.text}">${subjectShort}</text>

  ${examShort ? `<rect x="${14 + subjectShort.length * 6.5 + 24}" y="${titleY + titleLines.length * 18 + 14}" width="${examShort.length * 6 + 16}" height="16" rx="8" fill="${colors.accent}" opacity="0.08"/>
  <text x="${14 + subjectShort.length * 6.5 + 24 + (examShort.length * 6 + 16) / 2}" y="${titleY + titleLines.length * 18 + 26}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="600" fill="${colors.text}" opacity="0.8">${examShort}</text>` : ''}

  <!-- Footer brand -->
  <text x="14" y="150" font-family="Inter,Arial,sans-serif" font-size="9" fill="#94a3b8" font-weight="500">Academic Halt • Free Study Materials</text>
  <text x="266" y="150" text-anchor="end" font-family="Inter,Arial,sans-serif" font-size="9" fill="${colors.accent}" font-weight="700">${resource.type || 'PDF'}</text>
</svg>`;
}

const BATCH = parseInt(process.argv[2]) || 500;
const resourcesBatch = resources.slice(0, BATCH);

console.log(`🖼️  Generating ${BATCH} SVG thumbnails...`);

let count = 0;
for (const resource of resourcesBatch) {
  const svg = generateSVG(resource);
  fs.writeFileSync(path.join(THUMB_DIR, `${resource.slug}.svg`), svg);
  count++;
  if (count % 100 === 0) process.stdout.write(`\r  Generated: ${count}/${BATCH}`);
}

// Also generate generic category thumbnails
const cats = ['notes', 'books', 'question-papers', 'mock-tests', 'videos', 'study-guides'];
for (const cat of cats) {
  const r = { id: cat, slug: cat, category: cat.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()), title: cat.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) + ' - Free Download', subject: 'All Subjects', exam: 'All Exams', type: 'PDF' };
  const svg = generateSVG(r);
  fs.writeFileSync(path.join(THUMB_DIR, `${cat}-thumbnail.svg`), svg);
}

console.log(`\n✅ Generated ${count} thumbnails + ${cats.length} category thumbnails`);
console.log(`📁 Saved to /assets/thumbnails/`);
console.log(`\nTo generate ALL thumbnails: node scripts/generate-thumbnails.js 10000`);
