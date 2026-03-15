# JEE Halt — Free JEE Books & Study Material

A fully static, SEO-optimized website for free JEE Main, JEE Advanced & NEET study materials.

**Live site:** https://www.jeehalt.in

---

## 🚀 Quick Start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in /dist
npm run preview  # preview production build
```

---

## 📁 Project Structure

```
jeehalt/
├── public/
│   ├── admin/config.yml     ← Pages CMS config (edit GitHub username here)
│   ├── uploads/             ← Media uploads
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BookCard.astro
│   │   └── SearchBar.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── book/[slug].astro
│   │   ├── books/index.astro + [page].astro
│   │   ├── category/[slug].astro
│   │   ├── tag/[slug].astro
│   │   ├── brand/[slug].astro
│   │   ├── categories/index.astro
│   │   ├── tags/index.astro
│   │   ├── about.astro, contact.astro
│   │   ├── disclaimer.astro, privacy-policy.astro
│   │   ├── terms.astro, dmca.astro, 404.astro
│   │   └── sitemap.xml.ts
│   └── content/
│       ├── config.ts        ← Content schema (NO slug field)
│       └── books/           ← 54 book markdown files
├── astro.config.mjs
├── tailwind.config.js
└── package.json
```

---

## 🌐 Deploy to Cloudflare Pages

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version env var | `NODE_VERSION = 18` |

---

## 📝 Pages CMS Setup

1. Edit `public/admin/config.yml`
2. Replace `your-github-username/jeehalt` with your GitHub username
3. Push to GitHub
4. Login at https://app.pagescms.org with GitHub

---

## ✅ Key Fix Applied

Astro reserves the `slug` field in content collections.
This project uses `book.id` (filename without `.md`) as the slug.
The `config.ts` schema does NOT contain a `slug` field.

---

© 2026 JEE Halt. All rights reserved.
