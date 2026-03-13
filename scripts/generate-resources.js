#!/usr/bin/env node
// Academic Halt - Resource Generator
// Generates 10,000 educational resources in /data/resources.json

const fs = require('fs');
const path = require('path');

const exams = [
  'UPSC', 'JEE Main', 'JEE Advanced', 'NEET', 'SSC CGL', 'SSC CHSL', 'SSC MTS',
  'IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RBI Grade B', 'NABARD',
  'GATE CS', 'GATE EE', 'GATE ME', 'GATE CE', 'GATE ECE', 'GATE CH',
  'CAT', 'MAT', 'XAT', 'SNAP', 'GMAT',
  'Class 12', 'Class 11', 'Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6',
  'UPSC CAPF', 'NDA', 'CDS', 'AFCAT',
  'IELTS', 'TOEFL', 'GRE',
  'UPPSC', 'BPSC', 'MPPSC', 'RPSC', 'TNPSC', 'KPSC', 'WBPSC', 'OPSC',
  'Delhi Police', 'CISF', 'BSF', 'CRPF',
  'RRB NTPC', 'RRB Group D', 'RRB JE',
  'CLAT', 'AILET', 'LSAT',
  'CA Foundation', 'CA Inter', 'CA Final',
  'NET UGC', 'CSIR NET', 'SET',
  'CUET', 'BITSAT', 'VITEEE', 'COMEDK',
];

const subjects = {
  'Sciences': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Statistics', 'Biotechnology', 'Environmental Science'],
  'Humanities': ['History', 'Geography', 'Political Science', 'Economics', 'Sociology', 'Philosophy', 'Psychology', 'Anthropology'],
  'Languages': ['English', 'Hindi', 'Sanskrit', 'French', 'German', 'Spanish'],
  'Commerce': ['Accountancy', 'Business Studies', 'Finance', 'Marketing', 'Management', 'Entrepreneurship'],
  'Engineering': ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering', 'Machine Learning', 'Digital Electronics', 'Signals & Systems', 'Control Systems', 'Fluid Mechanics', 'Thermodynamics', 'Structural Engineering', 'Geotechnical Engineering'],
  'General': ['General Knowledge', 'Current Affairs', 'Reasoning', 'Quantitative Aptitude', 'English Language', 'General Awareness', 'Banking Awareness', 'Legal Aptitude'],
  'Medical': ['Anatomy', 'Physiology', 'Biochemistry', 'Pharmacology', 'Pathology', 'Microbiology', 'Forensic Medicine'],
};

const allSubjects = Object.values(subjects).flat();

const categories = ['Notes', 'Books', 'Question Papers', 'Mock Tests', 'Videos', 'Study Guides'];

const types = { 'Notes': 'PDF', 'Books': 'PDF', 'Question Papers': 'PDF', 'Mock Tests': 'Online', 'Videos': 'Video', 'Study Guides': 'PDF' };

const resourceTemplates = {
  'Notes': [
    '{subject} {suffix} Notes PDF',
    '{subject} Complete Notes {year}',
    '{subject} Short Notes for {exam}',
    '{subject} Handwritten Notes PDF',
    '{subject} Chapter-wise Notes',
    '{subject} Quick Revision Notes',
    '{subject} Important Topics Notes',
    '{subject} Summary Notes PDF',
    'Complete {subject} Notes for {exam}',
    '{exam} {subject} Notes Free Download',
  ],
  'Books': [
    '{subject} Textbook PDF Free Download',
    'Best {subject} Book for {exam}',
    '{subject} Reference Book PDF',
    'NCERT {subject} Class {class} PDF',
    '{subject} Guide Book {year}',
    '{subject} Comprehensive Book PDF',
    '{exam} {subject} Book Free PDF',
  ],
  'Question Papers': [
    '{exam} Previous Year Question Papers PDF',
    '{exam} {year} Question Paper with Solutions',
    '{exam} Last 10 Years Papers PDF',
    '{exam} {subject} Question Paper',
    '{exam} Sample Paper PDF',
    '{exam} Practice Papers with Answers',
    '{exam} Mock Question Paper PDF',
  ],
  'Mock Tests': [
    '{exam} Full Mock Test {number}',
    '{subject} Practice Test for {exam}',
    '{exam} Chapter-wise Mock Test',
    '{exam} Sectional Test - {subject}',
    '{exam} Online Mock Test Series',
    '{exam} Mini Mock Test PDF',
  ],
  'Study Guides': [
    '{exam} Complete Study Guide {year}',
    '{subject} Study Material for {exam}',
    '{exam} Preparation Guide PDF',
    '{exam} Topper Strategy Guide',
    '{subject} Exam Guide PDF',
  ],
};

const suffixes = ['PDF', 'Free Download', 'Complete', 'Comprehensive', 'Detailed', 'Concise', 'Master', 'Ultimate', ''];
const years = ['2023', '2024', '2025', '2024-25'];
const classes = ['6', '7', '8', '9', '10', '11', '12'];

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDescription(title, subject, exam, category) {
  const descs = [
    `Download free ${title}. This ${category.toLowerCase()} covers all important topics for ${exam} preparation.`,
    `Comprehensive ${subject} ${category.toLowerCase()} for ${exam} aspirants. Prepared by expert teachers and toppers.`,
    `Free ${title} with detailed explanations, examples, and practice questions for ${exam}.`,
    `Best ${subject} study material for ${exam}. Easy-to-understand notes with diagrams and formulas.`,
    `${title} - Carefully curated content aligned with the latest ${exam} syllabus and exam pattern.`,
    `Access free ${subject} ${category.toLowerCase()} for ${exam} preparation. Includes all important topics and previous year concepts.`,
    `High-quality ${title} prepared by subject experts. Perfect for ${exam} self-study and revision.`,
  ];
  return pick(descs);
}

function generateTitle(category, exam, subject) {
  const templates = resourceTemplates[category] || resourceTemplates['Notes'];
  let template = pick(templates);
  return template
    .replace('{subject}', subject)
    .replace('{exam}', exam)
    .replace('{suffix}', pick(suffixes))
    .replace('{year}', pick(years))
    .replace('{class}', pick(classes))
    .replace('{number}', Math.floor(Math.random() * 20) + 1)
    .trim()
    .replace(/\s+/g, ' ');
}

const categoryColors = {
  'Notes': '#2563eb',
  'Books': '#16a34a',
  'Question Papers': '#d97706',
  'Mock Tests': '#9333ea',
  'Videos': '#dc2626',
  'Study Guides': '#0891b2',
};

function generateResources(count = 10000) {
  const resources = [];
  const slugs = new Set();

  // Distribute resources across categories
  const catDist = {
    'Notes': Math.floor(count * 0.40),
    'Books': Math.floor(count * 0.15),
    'Question Papers': Math.floor(count * 0.20),
    'Mock Tests': Math.floor(count * 0.12),
    'Videos': Math.floor(count * 0.07),
    'Study Guides': Math.floor(count * 0.06),
  };

  let id = 1;

  for (const [category, catCount] of Object.entries(catDist)) {
    for (let i = 0; i < catCount; i++) {
      const exam = pick(exams);
      const subject = pick(allSubjects);
      const title = generateTitle(category, exam, subject);
      let slug = slugify(title);

      // Ensure unique slug
      let attempt = 0;
      while (slugs.has(slug)) {
        attempt++;
        slug = slugify(title) + '-' + attempt;
      }
      slugs.add(slug);

      resources.push({
        id: id++,
        title,
        slug,
        category,
        type: types[category],
        subject,
        exam,
        description: generateDescription(title, subject, exam, category),
        download_link: `https://drive.google.com/file/d/placeholder-${id}/view`,
        thumbnail: `/assets/thumbnails/${slug}.svg`,
        color: categoryColors[category],
        downloads: Math.floor(Math.random() * 50000) + 100,
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        pages: category === 'Videos' ? null : Math.floor(Math.random() * 200) + 10,
        dateAdded: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: [exam, subject, category, 'free', 'pdf'].filter(Boolean),
        featured: Math.random() < 0.05,
      });
    }
  }

  return resources;
}

console.log('🚀 Generating 10,000 educational resources...');
const resources = generateResources(10000);

const output = {
  meta: {
    total: resources.length,
    categories: [...new Set(resources.map(r => r.category))],
    exams: [...new Set(resources.map(r => r.exam))],
    subjects: [...new Set(resources.map(r => r.subject))],
    generated: new Date().toISOString(),
  },
  resources,
};

const outPath = path.join(__dirname, '../data/resources.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log(`✅ Generated ${resources.length} resources`);
console.log(`📁 Saved to ${outPath}`);
console.log(`📊 Categories: ${output.meta.categories.join(', ')}`);
console.log(`📚 Exams covered: ${output.meta.exams.length}`);
console.log(`🔬 Subjects covered: ${output.meta.subjects.length}`);
