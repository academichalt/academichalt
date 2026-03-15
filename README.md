# JEE Halt – Free JEE, NEET & CBSE Study Material

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=flat&logo=cloudflare)](https://pages.cloudflare.com/)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?style=flat&logo=astro)](https://astro.build/)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

> India's trusted platform for free JEE, NEET & CBSE books and study material.

## 🚀 Live Site

[https://www.jeehalt.in](https://www.jeehalt.in)

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
jeehalt/
├── public/
│   ├── robots.txt
│   ├── _headers          # Cloudflare security headers
│   └── _redirects        # Cloudflare redirects
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BookCard.astro
│   │   └── Breadcrumb.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── books.astro        # All books listing
│   │   ├── categories.astro   # Categories index
│   │   ├── tags.astro         # Tags index
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── 404.astro
│   │   ├── sitemap.xml.astro  # Auto-generated sitemap
│   │   ├── sitemap-page.astro
│   │   ├── privacy-policy.astro
│   │   ├── terms.astro
│   │   ├── disclaimer.astro
│   │   ├── dmca.astro
│   │   ├── book/
│   │   │   └── [slug].astro   # Individual book pages
│   │   ├── category/
│   │   │   └── [category].astro
│   │   └── tag/
│   │       └── [tag].astro
│   └── content/
│       ├── config.ts
│       └── books/             # 📚 Add new books here!
│           ├── hc-verma-concepts-physics-vol-1.md
│           ├── dc-pandey-mechanics-part-1.md
│           └── ... (53 books total)
├── astro.config.mjs
├── tailwind.config.js
└── package.json
```

---

## ➕ Adding a New Book

Create a new `.md` file in `src/content/books/`:

```markdown
---
title: "Book Title Here"
description: "80-120 word SEO-friendly description of the book."
author: "Author Name"
publisher: "Publisher Name"
category: "Physics"
tags: ["Mechanics", "JEE Main", "JEE Advanced"]
language: "English"
pages: 450
fileSize: "18 MB"
format: "PDF"
downloadLink: "https://your-download-link.com/file.pdf"
mirrorLinks:
  - "https://mirror1.com/file.pdf"
  - "https://mirror2.com/file.pdf"
faqs:
  - q: "Who should read this book?"
    a: "JEE aspirants and Class 11-12 students."
  - q: "Is it good for JEE Advanced?"
    a: "Yes, it is highly recommended for JEE Advanced."
---
```

The book will **automatically appear** on:
- ✅ Homepage book grid
- ✅ `/books` page
- ✅ Category page (`/category/Physics`)
- ✅ Tag pages for each tag
- ✅ Related books section
- ✅ XML sitemap

---

## 🌐 Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click **Create a project** → **Connect to Git**
4. Select your repository
5. Configure build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `18` or higher
6. Click **Save and Deploy**

---

## 🔍 SEO Features

- Meta title, description, canonical URL per page
- Open Graph & Twitter Card tags
- Structured data: Book, Article, FAQ, Breadcrumb schemas
- Auto-generated XML sitemap at `/sitemap.xml`
- Clean URLs (`/book/hc-verma-vol-1`, `/category/physics`)
- `robots.txt`
- Cloudflare security headers

---

## 📊 Performance

- Static Site Generation (SSG) – zero runtime cost
- No heavy JavaScript frameworks
- Google Fonts with `display=swap`
- Lazy loading images
- Minimal JS – only where needed
- Tailwind CSS with content purging

---

## 📄 License

This project is for educational purposes. All books belong to their respective copyright holders.

© 2026 JEE Halt. All rights reserved.
