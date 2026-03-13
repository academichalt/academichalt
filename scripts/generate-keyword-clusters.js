#!/usr/bin/env node
// Academic Halt - Keyword Dataset Generator
// Generates 300,000 education keywords in /data/keywords.json

const fs = require('fs');
const path = require('path');

const exams = [
  'upsc', 'ias', 'ips', 'ifs', 'upsc cse', 'upsc capf',
  'jee main', 'jee advanced', 'jee', 'iit jee',
  'neet', 'neet ug', 'neet pg', 'aiims',
  'ssc cgl', 'ssc chsl', 'ssc mts', 'ssc je', 'ssc gd', 'ssc',
  'ibps po', 'ibps clerk', 'ibps rrb', 'sbi po', 'sbi clerk', 'rbi grade b',
  'gate cs', 'gate ee', 'gate me', 'gate ce', 'gate ece',
  'cat', 'xat', 'snap', 'mat', 'gmat', 'mba',
  'class 12', 'class 11', 'class 10', 'class 9', 'class 8',
  'cbse class 12', 'cbse class 10', 'icse', 'state board',
  'nda', 'cds', 'afcat', 'coast guard',
  'uppsc', 'bpsc', 'mppsc', 'rpsc', 'tnpsc', 'kpsc', 'wbpsc',
  'rrb ntpc', 'rrb group d', 'rrb je',
  'clat', 'ailet', 'law entrance',
  'ca foundation', 'ca inter', 'ca final', 'cma', 'cs',
  'ugc net', 'csir net', 'set',
  'cuet', 'bitsat', 'viteee', 'comedk',
  'tgt', 'pgt', 'kvs', 'nvs', 'dsssb',
  'delhi police', 'cisf', 'bsf', 'crpf', 'itbp',
  'nabard', 'irda', 'sebi', 'sidbi',
];

const subjects = [
  'physics', 'chemistry', 'biology', 'mathematics', 'maths',
  'history', 'geography', 'polity', 'political science', 'economics',
  'english', 'hindi', 'sanskrit', 'general knowledge', 'gk',
  'current affairs', 'reasoning', 'logical reasoning', 'verbal reasoning',
  'quantitative aptitude', 'quant', 'data interpretation', 'di',
  'computer science', 'cs', 'information technology', 'it',
  'accountancy', 'business studies', 'commerce',
  'sociology', 'philosophy', 'psychology', 'anthropology',
  'statistics', 'biotechnology', 'environmental science',
  'data structures', 'algorithms', 'operating systems', 'dbms',
  'computer networks', 'software engineering', 'machine learning',
  'digital electronics', 'signals systems', 'control systems',
  'fluid mechanics', 'thermodynamics', 'structural engineering',
  'organic chemistry', 'inorganic chemistry', 'physical chemistry',
  'zoology', 'botany', 'anatomy', 'physiology', 'biochemistry',
  'calculus', 'algebra', 'trigonometry', 'coordinate geometry',
  'mechanics', 'electrostatics', 'magnetism', 'optics', 'modern physics',
  'banking awareness', 'financial awareness', 'legal aptitude',
  'ancient history', 'medieval history', 'modern history', 'world history',
  'indian geography', 'world geography', 'physical geography',
  'indian constitution', 'governance', 'international relations',
  'indian economy', 'microeconomics', 'macroeconomics',
];

const resourceTypes = [
  'notes pdf', 'notes', 'pdf', 'study material', 'study notes',
  'handwritten notes', 'short notes', 'revision notes', 'quick notes',
  'complete notes', 'chapter notes', 'topic wise notes',
  'book pdf', 'textbook pdf', 'reference book', 'best book',
  'previous year papers', 'question paper', 'past papers', 'pyq',
  'solved papers', 'sample paper', 'practice paper', 'model paper',
  'mock test', 'practice test', 'online test', 'free test',
  'formula sheet', 'formula list', 'important formulas',
  'important questions', 'mcq', 'objective questions',
  'ncert solutions', 'ncert notes', 'ncert pdf',
  'topper notes', 'ias notes', 'rank 1 notes',
  'free download', 'download pdf', 'free pdf',
  'lecture notes', 'class notes', 'coaching notes',
  'summary', 'synopsis', 'outline', 'mind map',
];

const classes = ['class 6', 'class 7', 'class 8', 'class 9', 'class 10', 'class 11', 'class 12'];
const chapters = [
  'chapter 1', 'chapter 2', 'chapter 3', 'chapter 4', 'chapter 5',
  'chapter 6', 'chapter 7', 'chapter 8', 'chapter 9', 'chapter 10',
  'unit 1', 'unit 2', 'unit 3', 'unit 4', 'unit 5',
];
const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2024-25', '2025-26'];
const modifiers = ['free', 'best', 'top', 'complete', 'comprehensive', 'detailed', 'all', 'latest', 'updated', 'new'];

function generateKeywords() {
  const keywords = new Set();

  // Pattern 1: exam + subject + type
  for (const exam of exams) {
    for (const subject of subjects.slice(0, 20)) {
      for (const type of resourceTypes.slice(0, 10)) {
        keywords.add(`${exam} ${subject} ${type}`);
        keywords.add(`${subject} ${type} for ${exam}`);
      }
    }
  }

  // Pattern 2: exam + type
  for (const exam of exams) {
    for (const type of resourceTypes) {
      keywords.add(`${exam} ${type}`);
      keywords.add(`best ${exam} ${type}`);
      keywords.add(`free ${exam} ${type}`);
      keywords.add(`${exam} ${type} download`);
    }
  }

  // Pattern 3: subject + type
  for (const subject of subjects) {
    for (const type of resourceTypes) {
      keywords.add(`${subject} ${type}`);
      keywords.add(`free ${subject} ${type}`);
      keywords.add(`best ${subject} ${type}`);
      keywords.add(`${subject} ${type} download`);
    }
  }

  // Pattern 4: class + subject + type
  for (const cls of classes) {
    for (const subject of subjects.slice(0, 15)) {
      for (const type of resourceTypes.slice(0, 8)) {
        keywords.add(`${cls} ${subject} ${type}`);
        keywords.add(`cbse ${cls} ${subject} ${type}`);
      }
    }
  }

  // Pattern 5: exam + year + type
  for (const exam of exams) {
    for (const year of years) {
      keywords.add(`${exam} ${year} question paper`);
      keywords.add(`${exam} ${year} paper pdf`);
      keywords.add(`${exam} ${year} notes`);
      keywords.add(`${exam} ${year} study material`);
    }
  }

  // Pattern 6: subject + chapter + type
  for (const subject of subjects.slice(0, 15)) {
    for (const chapter of chapters) {
      keywords.add(`${subject} ${chapter} notes`);
      keywords.add(`${subject} ${chapter} notes pdf`);
      keywords.add(`${subject} ${chapter} important questions`);
    }
  }

  // Pattern 7: modifiers
  for (const mod of modifiers) {
    for (const exam of exams.slice(0, 15)) {
      keywords.add(`${mod} ${exam} notes`);
      keywords.add(`${mod} ${exam} books`);
      keywords.add(`${mod} ${exam} study material`);
    }
    for (const subject of subjects.slice(0, 15)) {
      keywords.add(`${mod} ${subject} notes pdf`);
      keywords.add(`${mod} ${subject} book pdf`);
    }
  }

  // Pattern 8: specific topic keywords
  const specificTopics = [
    'upsc prelims notes', 'upsc mains notes', 'upsc optional notes',
    'jee physics notes', 'jee chemistry notes', 'jee maths notes',
    'neet biology notes', 'neet physics notes', 'neet chemistry notes',
    'ssc general awareness notes', 'ssc english notes', 'ssc reasoning notes',
    'banking quant notes', 'banking reasoning notes', 'banking english notes',
    'gate previous year questions', 'gate topic wise notes',
    'cat quant notes', 'cat varc notes', 'cat dilr notes',
    'ncert class 10 science notes', 'ncert class 12 physics notes',
    'class 12 organic chemistry notes', 'class 12 integration notes',
    'class 10 real numbers notes', 'class 10 polynomials notes',
    'upsc geography map notes', 'upsc economy notes budget',
    'current affairs monthly notes', 'daily current affairs pdf',
    'gk notes for competitive exams', 'gk tricks pdf',
    'reasoning tricks pdf', 'shortcuts for quantitative aptitude',
    'english grammar notes pdf', 'vocabulary notes for exams',
    'static gk notes', 'current affairs 2024 notes',
    'ncert summary class 6 to 12', 'laxmikant polity notes',
    'spectrum modern history notes', 'certificate physical geography notes',
    'gs score notes', 'vision ias notes', 'drishti ias notes',
    'unacademy notes pdf', 'byju notes pdf',
    'handwritten notes for upsc', 'handwritten notes for jee',
    'topper handwritten notes', 'rank 1 notes pdf',
    'previous 10 years question papers pdf', 'last 5 years papers pdf',
    'important formulas for jee pdf', 'physics formula sheet pdf',
    'chemistry formula sheet pdf', 'maths formula sheet class 12',
  ];
  specificTopics.forEach(t => keywords.add(t));

  // Pattern 9: state board keywords
  const states = ['maharashtra', 'up', 'bihar', 'rajasthan', 'mp', 'gujarat', 'karnataka', 'tamilnadu', 'kerala', 'andhra'];
  const stateBoards = ['hsc', 'ssc', 'board'];
  for (const state of states) {
    for (const board of stateBoards) {
      keywords.add(`${state} ${board} notes`);
      keywords.add(`${state} ${board} question paper`);
      keywords.add(`${state} board class 12 notes`);
      keywords.add(`${state} board class 10 notes`);
    }
  }

  return [...keywords];
}

console.log('🚀 Generating keyword dataset...');
const keywords = generateKeywords();
console.log(`📊 Raw keywords generated: ${keywords.length}`);

// Trim to 300,000
const finalKeywords = keywords.slice(0, 300000);

const output = {
  meta: {
    total: finalKeywords.length,
    generated: new Date().toISOString(),
    description: 'Education keywords for programmatic SEO pages'
  },
  keywords: finalKeywords
};

const outPath = path.join(__dirname, '../data/keywords.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log(`✅ Generated ${finalKeywords.length} keywords`);
console.log(`📁 Saved to ${outPath}`);
console.log(`📦 File size: ${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB`);
console.log(`\nSample keywords:`);
finalKeywords.slice(0, 10).forEach(k => console.log(' -', k));
