#!/usr/bin/env node
// Academic Halt - Blog Post Generator
// Generates 50,000 blog posts from templates

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const BLOG_DIR = path.join(BASE_DIR, 'blog');
const TEMPLATE = fs.readFileSync(path.join(BASE_DIR, 'templates/blog-template.html'), 'utf8');

// === CONTENT DATA ===
const exams = ['UPSC', 'JEE Main', 'JEE Advanced', 'NEET', 'SSC CGL', 'SSC CHSL', 'IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RBI Grade B', 'GATE CS', 'GATE EE', 'CAT', 'Class 12', 'Class 10', 'Class 11', 'NDA', 'CDS', 'UPPSC', 'BPSC', 'CLAT', 'UGC NET', 'RRB NTPC', 'AFCAT'];
const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'History', 'Geography', 'Polity', 'Economics', 'English', 'General Knowledge', 'Current Affairs', 'Reasoning', 'Quantitative Aptitude', 'Computer Science', 'Accountancy', 'Business Studies'];
const topics = ['Preparation Strategy', 'Best Books', 'Study Plan', 'Time Management', 'Previous Year Analysis', 'Important Topics', 'Syllabus Guide', 'Mock Test Strategy', 'Revision Tips', 'Topper Tips', 'Notes Guide', 'Study Material', 'Short Tricks', 'Formula Sheet', 'Chapter Summary'];
const authors = ['Priya Sharma', 'Rahul Gupta', 'Anjali Singh', 'Vikram Patel', 'Neha Agarwal', 'Aditya Kumar', 'Pooja Mehta', 'Sanjay Rao', 'Kavita Nair', 'Amit Joshi'];
const categories = ['Exam Tips', 'Study Tips', 'Best Books', 'Preparation Guide', 'Time Management', 'Topper Strategy', 'Subject Guide', 'Current Affairs', 'Mock Test Tips', 'Revision Strategy'];

const gradients = [
  'linear-gradient(135deg,#1d4ed8,#7c3aed)', 'linear-gradient(135deg,#065f46,#0891b2)',
  'linear-gradient(135deg,#9a3412,#d97706)', 'linear-gradient(135deg,#7c3aed,#e11d48)',
  'linear-gradient(135deg,#0891b2,#1d4ed8)', 'linear-gradient(135deg,#059669,#0891b2)',
  'linear-gradient(135deg,#dc2626,#9333ea)', 'linear-gradient(135deg,#1e3a8a,#065f46)',
];

const heroEmojis = ['📚', '🎯', '✍️', '💡', '🏆', '⚡', '🔥', '🧠', '📊', '🎓', '⚛️', '🧬', '📐', '🏛️', '💻'];

// Title templates
const titleTemplates = [
  'How to Crack {exam} in First Attempt: Complete Strategy Guide',
  '{exam} {topic}: Expert Tips from Top Rankers',
  'Best Books for {exam} {subject}: Complete List {year}',
  '{subject} Notes for {exam}: Free PDF Download Guide',
  '{exam} Preparation Strategy for {year}: Month-wise Plan',
  'How to Score 90%+ in {exam} {subject}: Proven Techniques',
  '{exam} {subject} Important Topics for {year} Exam',
  'Complete {exam} Syllabus {year}: Subject-wise Breakdown',
  '{topic} for {exam} Aspirants: Everything You Need to Know',
  'Top 10 Mistakes to Avoid While Preparing for {exam}',
  '{subject} {topic} for {exam}: A Comprehensive Guide',
  'How to Prepare {subject} for {exam} in 30 Days',
  '{exam} Previous Year Papers Analysis: Important Topics',
  'Free {exam} Study Material: Best Resources for {year}',
  '{exam} Mock Test Strategy: How to Use Practice Tests Effectively',
  'How Toppers Prepare for {exam}: Revealed Study Secrets',
  '{subject} Formula Sheet for {exam}: All Important Formulas',
  'Last Minute Revision Strategy for {exam} {year}',
  '{exam} Answer Writing Tips for Mains: Score More Marks',
  'How to Make Effective Notes for {exam} Preparation',
  '{subject} Chapter-wise Weightage in {exam}: Where to Focus',
  'Time Management for {exam} Preparation: Daily Schedule',
  '{exam} vs {exam2}: Which is Harder and How to Prepare',
  'Self-Study vs Coaching for {exam}: What Works Best',
  '{exam} Cut-off Analysis {year}: Marks Required to Qualify',
];

// TOC templates by category
const tocTemplates = {
  'strategy': ['Introduction', 'Understanding the Exam', 'Creating Your Study Plan', 'Important Resources', 'Practice and Mock Tests', 'Revision Strategy', 'Exam Day Tips', 'Conclusion'],
  'books': ['Introduction', 'Subject-wise Book List', 'Physics Books', 'Chemistry Books', 'Mathematics Books', 'General Studies Books', 'How to Choose the Right Book', 'Conclusion'],
  'subject': ['Introduction', 'Syllabus Overview', 'Important Topics', 'Study Strategy', 'Best Resources', 'Practice Questions', 'Tips from Toppers', 'Conclusion'],
  'tips': ['Introduction', 'Common Mistakes to Avoid', 'Proven Techniques', 'Study Schedule', 'Mock Test Strategy', 'Revision Tips', 'Mental Health and Motivation', 'Conclusion'],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) { return [...arr].sort(() => 0.5 - Math.random()).slice(0, n); }

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function makeTitle(template, exam, subject, topic, year) {
  const exam2 = pick(exams.filter(e => e !== exam));
  return template
    .replace(/{exam}/g, exam)
    .replace(/{exam2}/g, exam2)
    .replace(/{subject}/g, subject)
    .replace(/{topic}/g, topic)
    .replace(/{year}/g, year);
}

function makeMetaDesc(title, exam, subject) {
  const descs = [
    `Complete guide to ${title}. Expert tips, strategies, and free resources for ${exam} preparation.`,
    `Everything you need to know about ${title}. Proven strategies from ${exam} toppers and expert educators.`,
    `Comprehensive article on ${title}. Download free ${subject} study materials and ace your ${exam} exam.`,
    `Master ${title} with our expert guide. Includes study plan, best books, and free PDF resources for ${exam}.`,
  ];
  return pick(descs);
}

function makeArticleContent(exam, subject, topic, cat) {
  const tocKey = ['strategy','tips','tips','books','subject','tips'][Math.floor(Math.random() * 6)];
  const toc = (tocTemplates[tocKey] || tocTemplates['tips']);

  const sections = toc.slice(1, -1).map((heading, i) => {
    const paragraphs = [
      `${heading} is a crucial aspect of ${exam} preparation that many aspirants overlook. Understanding this component deeply can make a significant difference in your final score. Experts and toppers consistently emphasize the importance of ${heading.toLowerCase()} in their success stories.`,
      `When it comes to ${exam} preparation, ${heading.toLowerCase()} cannot be ignored. Students who perform well in ${exam} typically have a strong foundation in all aspects of their preparation, including ${heading.toLowerCase()}. This systematic approach separates high scorers from average performers.`,
      `For ${subject} specifically, ${heading.toLowerCase()} plays a vital role. The ${exam} examinations have consistently tested students on concepts that require thorough understanding and regular practice. Building a strong foundation through proper ${heading.toLowerCase()} is essential for long-term success.`,
    ];

    const bullet_sets = [
      [`Start with the basics before moving to advanced topics`, `Practice regularly with timed sessions`, `Review mistakes and learn from them`, `Use multiple resources to reinforce concepts`],
      [`Create a structured study schedule and follow it consistently`, `Take regular breaks to avoid burnout`, `Study in short focused sessions for maximum retention`, `Revise previous topics before moving to new ones`],
      [`Focus on understanding concepts rather than rote memorization`, `Use visual aids like diagrams and mind maps`, `Teach concepts to others to solidify your understanding`, `Track your progress with weekly self-assessments`],
    ];

    return `
      <h2 id="section-${i + 1}">${heading}</h2>
      <p>${pick(paragraphs)}</p>
      <p>${pick(paragraphs)}</p>
      <ul>${pick(bullet_sets).map(b => `<li>${b}</li>`).join('')}</ul>
    `;
  });

  const intro = `<p>Preparing for ${exam} requires a strategic approach, dedication, and access to the right study materials. This comprehensive guide covers everything you need to know about ${topic.toLowerCase()} for ${exam}, drawing from the experiences of toppers, expert educators, and our extensive research on ${exam} preparation strategies.</p>
  <p>Whether you are a first-time aspirant or someone who has appeared for ${exam} before, this guide provides actionable insights that you can implement immediately to improve your preparation and performance.</p>`;

  const conclusion = `
    <h2 id="section-conclusion">Conclusion</h2>
    <p>Success in ${exam} requires consistent effort, smart preparation, and access to quality study materials. By following the strategies outlined in this guide and leveraging the free resources available on Academic Halt, you can significantly improve your chances of clearing ${exam} with a high rank.</p>
    <p>Remember that ${exam} preparation is a marathon, not a sprint. Stay consistent, review regularly, and maintain a positive mindset throughout your preparation journey. Download our free ${subject} notes and start your preparation today!</p>
    <div class="tip-box"><p>💡 <strong>Pro Tip:</strong> Download free ${exam} study materials from Academic Halt. We have 10,000+ free notes, books, and question papers to support your preparation.</p></div>
    <div style="text-align:center;margin-top:24px">
      <a href="/study-material/" class="btn btn-primary btn-lg">⬇️ Download Free ${exam} Materials</a>
    </div>`;

  return intro + sections.join('') + conclusion;
}

function makeTOCItems(exam, subject) {
  const tocKey = pick(['strategy', 'tips', 'books', 'subject']);
  const toc = tocTemplates[tocKey] || tocTemplates['tips'];
  return toc.map((item, i) =>
    `<li><a href="#section-${i}">${item}</a></li>`
  ).join('');
}

function generatePost(id) {
  const exam = pick(exams);
  const subject = pick(subjects);
  const topic = pick(topics);
  const cat = pick(categories);
  const author = pick(authors);
  const year = pick(['2024', '2025', '2024-25']);
  const template = pick(titleTemplates);

  const title = makeTitle(template, exam, subject, topic, year);
  const slug = slugify(title);
  const metaDesc = makeMetaDesc(title, exam, subject);
  const readTime = Math.floor(Math.random() * 8) + 5;
  const views = Math.floor(Math.random() * 45000) + 1000;
  const gradient = pick(gradients);
  const heroEmoji = pick(heroEmojis);
  const authorInitial = author.charAt(0);
  const publishDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  const dateStr = publishDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  const dateISO = publishDate.toISOString().split('T')[0];

  const tags = pickN([exam, subject, topic, cat, 'study tips', 'free notes', 'exam preparation'], 5)
    .map(t => `<a href="/blog/" class="tag" style="font-size:12px">${t}</a>`).join('');

  const articleContent = makeArticleContent(exam, subject, topic, cat);
  const tocItems = makeTOCItems(exam, subject);

  let page = TEMPLATE
    .replace(/{{TITLE}}/g, title)
    .replace(/{{META_DESCRIPTION}}/g, metaDesc)
    .replace(/{{META_KEYWORDS}}/g, `${exam.toLowerCase()}, ${subject.toLowerCase()}, ${topic.toLowerCase()}, exam preparation, study tips, free notes`)
    .replace(/{{SLUG}}/g, slug)
    .replace(/{{CATEGORY}}/g, cat)
    .replace(/{{AUTHOR}}/g, author)
    .replace(/{{AUTHOR_INITIAL}}/g, authorInitial)
    .replace(/{{DATE_PUBLISHED}}/g, dateStr)
    .replace(/{{DATE_MODIFIED}}/g, dateStr)
    .replace(/{{READ_TIME}}/g, readTime)
    .replace(/{{VIEWS}}/g, views.toLocaleString())
    .replace(/{{HERO_GRADIENT}}/g, gradient)
    .replace(/{{HERO_EMOJI}}/g, heroEmoji)
    .replace(/{{TOC_ITEMS}}/g, tocItems)
    .replace(/{{ARTICLE_CONTENT}}/g, articleContent)
    .replace(/{{TAGS}}/g, tags);

  return { slug, page, title };
}

// === MAIN GENERATION ===
const TARGET = parseInt(process.argv[2]) || 100; // Default 100 for testing; set to 50000 for production
const BATCH_SIZE = 500;

console.log(`🚀 Generating ${TARGET.toLocaleString()} blog posts...`);
console.log(`📁 Output directory: ${BLOG_DIR}\n`);

fs.mkdirSync(BLOG_DIR, { recursive: true });

const slugIndex = [];
const slugSet = new Set();
let generated = 0;
let skipped = 0;

for (let i = 0; i < TARGET; i++) {
  const { slug, page, title } = generatePost(i);

  // Ensure unique slugs
  let finalSlug = slug;
  let attempt = 0;
  while (slugSet.has(finalSlug)) {
    attempt++;
    finalSlug = slug + '-' + attempt;
  }
  slugSet.add(finalSlug);

  const postDir = path.join(BLOG_DIR, finalSlug);
  fs.mkdirSync(postDir, { recursive: true });
  fs.writeFileSync(path.join(postDir, 'index.html'), page);

  slugIndex.push({ slug: finalSlug, title });
  generated++;

  if (generated % BATCH_SIZE === 0 || generated === TARGET) {
    const pct = ((generated / TARGET) * 100).toFixed(1);
    process.stdout.write(`\r  Progress: ${generated.toLocaleString()}/${TARGET.toLocaleString()} (${pct}%)`);
  }
}

// Save blog index JSON for sitemap and search
fs.writeFileSync(
  path.join(BASE_DIR, 'data/blog-index.json'),
  JSON.stringify({ total: generated, posts: slugIndex }, null, 2)
);

console.log(`\n\n✅ Generated ${generated.toLocaleString()} blog posts`);
console.log(`📄 Blog index saved to data/blog-index.json`);
console.log(`\nTo generate all 50,000 posts, run:`);
console.log(`  node scripts/generate-blog-posts.js 50000`);
