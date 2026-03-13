# Academic Halt 🎓

> India's largest free study materials platform — 10,000+ resources, 50,000+ blog posts, 300,000 SEO pages

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange)](https://pages.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Start](#quick-start)
5. [Build Scripts](#build-scripts)
6. [Deployment](#deployment)
7. [SEO Architecture](#seo-architecture)
8. [Adding Content](#adding-content)
9. [Customization](#customization)
10. [Performance](#performance)

---

## Project Overview

Academic Halt is a **100% static website** targeting 10M+ monthly visitors. It provides free study materials for Indian competitive exams (UPSC, JEE, NEET, SSC, Banking, GATE, etc.) and board examinations.

**Scale targets:**
- 10,000+ individual resource pages
- 50,000+ blog posts
- 300,000 programmatic SEO pages
- 500+ exam categories
- 10M+ monthly pageviews

**Tech approach:** Pure static HTML/CSS/JS — no server, no database, no backend. All content is pre-generated at build time. Deployed on Cloudflare Pages for global CDN and near-zero cost at any traffic scale.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Build Scripts | Node.js (v18+) |
| Hosting | Cloudflare Pages |
| Version Control | GitHub |
| CDN | Cloudflare (automatic) |
| Forms | Formspree / Netlify Forms |
| Analytics | Google Analytics 4 |
| Search | Client-side (resources.json) |

---

## Project Structure

```
academic-halt/
│
├── index.html                    # Homepage
├── about.html                    # About page
├── contact.html                  # Contact page
├── privacy-policy.html           # Privacy policy
├── terms.html                    # Terms of service
├── disclaimer.html               # Disclaimer
├── search.html                   # Search page
├── robots.txt                    # SEO robots file
├── sitemap.xml                   # Generated sitemap
│
├── /css/
│   ├── style.css                 # Global styles & design system
│   └── components.css            # Component styles
│
├── /js/
│   ├── script.js                 # Core JS (nav, FAQ, utilities)
│   ├── search.js                 # Search functionality
│   ├── resource-loader.js        # Resource grid loader
│   ├── interlinking.js           # Internal linking engine
│   └── breadcrumbs.js            # Auto breadcrumb generator
│
├── /data/
│   ├── resources.json            # 10,000 resource records
│   ├── categories.json           # Category taxonomy
│   ├── keywords.json             # 75,000+ SEO keywords
│   ├── clusters.json             # 20 keyword clusters
│   └── blog-index.json           # Blog post index (generated)
│
├── /templates/
│   ├── resource-template.html    # Individual resource page template
│   ├── blog-template.html        # Blog post template
│   └── seo-template.html         # Keyword landing page template
│
├── /scripts/                     # Build scripts (Node.js)
│   ├── generate-resources.js     # Generates resources.json
│   ├── generate-seo-pages.js     # Generates SEO landing pages
│   ├── generate-blog-posts.js    # Generates 50,000 blog posts
│   ├── generate-thumbnails.js    # Generates SVG thumbnails
│   ├── generate-sitemap.js       # Generates sitemap.xml
│   └── generate-keyword-clusters.js  # Generates keywords.json
│
├── /assets/
│   ├── logo.svg                  # Site logo
│   └── /thumbnails/              # 10,000+ SVG thumbnails
│
├── /components/
│   ├── header.html               # Reusable header HTML
│   └── footer.html               # Reusable footer HTML
│
├── /study-material/index.html    # All materials listing page
├── /notes/index.html             # Notes category page
├── /books/index.html             # Books category page
├── /question-papers/index.html   # Papers category page
├── /mock-tests/index.html        # Mock tests page
├── /videos/index.html            # Videos page
├── /blog/index.html              # Blog index
│   └── /blog/[slug]/index.html   # Generated blog posts (50,000)
│
├── /tools/
│   ├── index.html                # Tools index
│   ├── /pomodoro-timer/          # Pomodoro study timer
│   ├── /gpa-calculator/          # GPA & grade calculator
│   ├── /exam-countdown/          # Countdown + word counter
│   └── /quiz-generator/          # Quiz + flashcard generator
│
├── /upsc-notes/index.html        # UPSC SEO page
├── /jee-notes/index.html         # JEE SEO page
├── /neet-notes/index.html        # NEET SEO page
├── /[200+ more SEO pages]/       # Generated keyword pages
│
└── /[slug]/index.html            # Individual resource pages (10,000)
```

---

## Quick Start

### Prerequisites
- Node.js v18 or higher
- Git
- A GitHub account
- A Cloudflare account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/academic-halt.git
cd academic-halt
```

### 2. Run All Build Scripts

```bash
# Step 1: Generate 10,000 resources
node scripts/generate-resources.js

# Step 2: Generate keyword dataset
node scripts/generate-keyword-clusters.js

# Step 3: Generate SEO landing pages (35 pages)
node scripts/generate-seo-pages.js

# Step 4: Generate 100 sample blog posts (use 50000 for production)
node scripts/generate-blog-posts.js 100

# Step 5: Generate SVG thumbnails (use 10000 for all)
node scripts/generate-thumbnails.js 500

# Step 6: Generate sitemap
node scripts/generate-sitemap.js
```

### 3. Preview Locally

Since this is a static site, you can preview it with any local server:

```bash
# Option 1: Python (built-in)
python3 -m http.server 8080

# Option 2: Node.js live-server
npx live-server --port=8080

# Option 3: VSCode Live Server extension
# Right-click index.html → "Open with Live Server"
```

Open http://localhost:8080 in your browser.

---

## Build Scripts

### generate-resources.js
Generates `data/resources.json` with 10,000 educational resources.

```bash
node scripts/generate-resources.js
```

**Output:** `/data/resources.json` (~8MB, 10,000 records)

Each resource has: id, title, slug, category, type, subject, exam, description, download_link, thumbnail, color, downloads, rating, pages, dateAdded, tags, featured.

### generate-seo-pages.js
Generates HTML pages for all keyword clusters and high-value keywords.

```bash
node scripts/generate-seo-pages.js
```

**Output:** 35+ landing pages (e.g., `/upsc-notes/`, `/jee-physics-notes-pdf/`)

To expand to 300,000 pages, extend the `topKeywordPages` array and `clusters` data.

### generate-blog-posts.js
Generates blog posts from templates.

```bash
# Generate 100 posts (testing)
node scripts/generate-blog-posts.js 100

# Generate all 50,000 posts (production — takes ~10-15 minutes)
node scripts/generate-blog-posts.js 50000
```

**Output:** `/blog/[slug]/index.html` for each post + `data/blog-index.json`

### generate-thumbnails.js
Generates SVG thumbnails for resource cards.

```bash
# Generate 500 thumbnails (fast)
node scripts/generate-thumbnails.js 500

# Generate all 10,000 thumbnails
node scripts/generate-thumbnails.js 10000
```

**Output:** `/assets/thumbnails/[slug].svg`

### generate-sitemap.js
Generates `sitemap.xml` with all pages.

```bash
node scripts/generate-sitemap.js
```

**Output:** `/sitemap.xml` (submit to Google Search Console)

---

## Deployment

### Deploy to Cloudflare Pages (Recommended)

Cloudflare Pages is the ideal host for this project — free tier handles unlimited traffic, global CDN, automatic HTTPS.

#### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial Academic Halt build"
   git remote add origin https://github.com/yourusername/academic-halt.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to **Workers & Pages** → **Create application** → **Pages**
   - Click **Connect to Git** → Select your GitHub repo
   - **Build settings:**
     - Framework preset: `None`
     - Build command: `node scripts/generate-resources.js && node scripts/generate-seo-pages.js && node scripts/generate-blog-posts.js 50000 && node scripts/generate-thumbnails.js 10000 && node scripts/generate-sitemap.js`
     - Build output directory: `/` (root)
   - Click **Save and Deploy**

3. **Add your custom domain:**
   - Go to your Pages project → **Custom domains** → **Set up a custom domain**
   - Enter `www.academichalt.com` and `academichalt.com`
   - Add the CNAME records in your domain registrar DNS settings

#### Method 2: Direct Upload (Quick Deploy)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Authenticate
wrangler login

# Deploy
wrangler pages deploy . --project-name=academic-halt
```

### Deploy to GitHub Pages (Alternative)

1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from a branch** → `main` → `/ (root)`
3. Click Save — site will be at `https://yourusername.github.io/academic-halt/`

### Environment Variables

For the contact form to work in production, integrate with a form handler:

**Formspree (easiest):**
```html
<!-- In contact.html, replace the submitContact() function with: -->
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Or use Cloudflare Pages Functions** for server-side form handling.

---

## SEO Architecture

### URL Structure
```
/ (homepage)
/study-material/          ← All materials hub
/notes/                   ← Notes category
/books/                   ← Books category
/upsc-notes/              ← Exam cluster page (generated)
/jee-physics-notes-pdf/   ← High-value keyword page (generated)
/[resource-slug]/         ← Individual resource page (10,000)
/blog/                    ← Blog index
/blog/[post-slug]/        ← Blog post (50,000)
/tools/                   ← Tools hub
/tools/pomodoro-timer/    ← Individual tool
```

### Scaling to 300,000 Pages

To generate 300,000 programmatic SEO pages:

1. **Expand keywords.json** — run `generate-keyword-clusters.js` with larger datasets
2. **Add keyword patterns** to the generator script
3. **Run generate-seo-pages.js** — it reads from `data/clusters.json` and creates pages
4. **For Cloudflare Pages**, split into multiple deploys or use Workers KV for dynamic content

### Key SEO Elements per Page
- Unique `<title>` and `<meta description>`
- Canonical URL
- Open Graph tags
- Breadcrumb Schema (JSON-LD)
- Article/Product Schema
- FAQ Schema
- Internal linking via `interlinking.js`
- H1-H3 hierarchy
- 800-1500 word SEO article per page

---

## Adding Content

### Adding Real Resources

Edit `data/resources.json` or modify `scripts/generate-resources.js`:

```javascript
// Add a real resource to resources.json
{
  "id": 10001,
  "title": "UPSC Polity Notes by Vision IAS PDF",
  "slug": "upsc-polity-notes-vision-ias-pdf",
  "category": "Notes",
  "type": "PDF",
  "subject": "Polity",
  "exam": "UPSC",
  "description": "Comprehensive UPSC polity notes by Vision IAS covering all constitutional provisions...",
  "download_link": "https://drive.google.com/file/d/YOUR_FILE_ID/view",
  "thumbnail": "/assets/thumbnails/upsc-polity-notes-vision-ias-pdf.svg",
  "color": "#2563eb",
  "downloads": 25000,
  "rating": "4.8",
  "pages": 180,
  "dateAdded": "2024-12-01",
  "tags": ["UPSC", "Polity", "Notes", "Vision IAS", "free"],
  "featured": true
}
```

### Adding Blog Posts

Create a new file at `/blog/[your-slug]/index.html` using `templates/blog-template.html` as the base. Or add the post to the blog generator:

```bash
node scripts/generate-blog-posts.js 1  # generates 1 new post
```

### Adding SEO Pages

Add new keyword clusters to `data/clusters.json`, then run:

```bash
node scripts/generate-seo-pages.js
```

---

## Customization

### Branding

Edit CSS variables in `css/style.css`:

```css
:root {
  --primary: #2563eb;        /* Change primary color */
  --secondary: #1e293b;      /* Dark background color */
  --accent: #22c55e;         /* Green accent */
  /* ... */
}
```

### Google Analytics

Add your GA4 tracking ID to each HTML file's `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Google AdSense

Add to `<head>` after GA:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

---

## Performance

### Page Speed Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimizations Built In
- ✅ Lazy loading images (`loading="lazy"`)
- ✅ SVG thumbnails (tiny file size vs PNG/JPEG)
- ✅ CSS variables for consistent theming without redundancy
- ✅ Async/deferred JS where possible
- ✅ No heavy JS frameworks (vanilla JS only)
- ✅ Google Fonts preconnect
- ✅ Cloudflare CDN caching
- ✅ resources.json cached in memory after first load
- ✅ IntersectionObserver for scroll animations

### Additional Optimizations for Production
1. Minify CSS/JS: `npx minify-all`
2. Compress images: All thumbnails are SVG (already optimal)
3. Enable Cloudflare Auto Minify in dashboard settings
4. Enable Cloudflare Rocket Loader for JS
5. Set Cache-Control headers in `_headers` file

---

## Support

For questions or issues, contact us at:
- **Email:** contact@academichalt.com
- **Website:** https://www.academichalt.com/contact.html

---

*Built with ❤️ for students across India — Academic Halt Team*
