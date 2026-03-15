# Academic Halt — Complete Setup & Deployment Guide

> **Free Books & Study Materials for Students**
> https://www.academichalt.com

---

## ⚡ Quick Start (5 minutes)

```bash
git clone https://github.com/YOUR-USERNAME/academic-halt.git
cd academic-halt
# Open index.html in browser — works immediately, no build step
```

---

## 🐛 Known Issues Fixed (v2)

| # | Bug | Fix Applied |
|---|-----|-------------|
| 1 | Google Fonts loaded via CSS `@import` (slow, blocks render) | Moved to `<link>` in `<head>` with `preconnect` |
| 2 | Font `<link>` placed after CSS `<link>` (wrong order) | Fonts now load before stylesheet |
| 3 | Scroll animation set `opacity:0` before IntersectionObserver fired | Cards in viewport stay visible; only off-screen cards animate |
| 4 | Blog sidebar used inline `grid-template-columns` with no mobile breakpoint | Replaced with `.article-layout` / `.article-sidebar` CSS classes |
| 5 | Contact page 2-col grid had no mobile breakpoint | Uses `.grid-2` class (responsive) |
| 6 | Mobile nav didn't change hamburger icon to ✕ when open | JS now swaps SVG icon on toggle |
| 7 | Clicking outside mobile nav didn't close it | Outside-click handler added |
| 8 | `data-book-title` attribute on download buttons missing | Replaced `download-trigger` class with `data-book-title` attribute |
| 9 | Bad directory `{css,js,assets` created by shell glob | Removed |

---

## 📁 Repository Structure

```
academic-halt/
│
├── index.html                 ← Homepage
├── about.html
├── contact.html
├── privacy-policy.html
├── terms.html
├── robots.txt
├── sitemap.xml
├── _redirects                 ← Cloudflare / Netlify redirect rules
│
├── class-9/
│   ├── index.html             ← Category page (books rendered by JS)
│   ├── ncert-mathematics-class-9.html
│   ├── ncert-science-class-9.html
│   └── ncert-beehive-english-class-9.html
│
├── class-10/  (same structure)
├── class-11/  (same structure)
├── class-12/  (same structure)
├── jee-main/  (same structure)
├── jee-advanced/
│   ├── index.html
│   ├── hc-verma-concepts-of-physics.html  ← Full detail page
│   ├── jd-lee-inorganic-chemistry-jee-advanced.html
│   └── sl-loney-plane-trigonometry.html
├── neet/   (same structure)
├── upsc/   (same structure)
│
├── blog/
│   ├── index.html
│   ├── best-books-for-jee-main.html
│   ├── best-books-for-jee-advanced.html
│   ├── best-books-for-neet.html
│   ├── best-books-for-upsc.html
│   ├── study-tips-for-board-exams.html
│   └── how-to-study-ncert-for-competitive-exams.html
│
├── admin/
│   ├── index.html             ← Decap CMS panel (visit /admin/)
│   └── config.yml             ← CMS configuration (edit this first)
│
├── content/
│   ├── books/                 ← Markdown files managed by CMS
│   └── blog/
│
├── assets/
│   ├── logo.svg
│   └── book-covers/           ← Upload cover images here
│
├── css/
│   └── style.css              ← All styles (single file, no build needed)
│
├── js/
│   ├── books-data.js          ← All books database (edit to add books)
│   ├── script.js              ← Navigation, FAQ, card rendering
│   └── search.js              ← Live search
│
└── components/
    ├── header.html            ← Reference snippet
    └── footer.html            ← Reference snippet
```

---

## 🚀 Deployment — Step by Step

### Step 1 — Upload to GitHub

```bash
# 1. Create a new repository on github.com named: academic-halt

# 2. In your terminal:
git init
git add .
git commit -m "Initial commit — Academic Halt v2"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/academic-halt.git
git push -u origin main
```

---

### Step 2A — Deploy on Cloudflare Pages (Recommended — Fastest)

Cloudflare Pages is the best option for this site. Free, fast global CDN, custom domains.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

2. Select your `academic-halt` repository

3. Set build settings:
   ```
   Framework preset:    None
   Build command:       (leave completely empty)
   Build output dir:    /
   ```

4. Click **Save and Deploy**. Your site will be live in ~30 seconds at:
   ```
   https://academic-halt-xxx.pages.dev
   ```

5. **Add custom domain** (optional):
   - In your Pages project → **Custom domains** → **Set up a custom domain**
   - Enter: `www.academichalt.com`
   - If your domain is on Cloudflare, DNS is configured automatically
   - If not on Cloudflare, add a CNAME: `www` → `academic-halt-xxx.pages.dev`

---

### Step 2B — Deploy on GitHub Pages

1. Go to your repository on GitHub

2. Click **Settings** → **Pages** (in left sidebar)

3. Under **Source**, select:
   - Source: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`

4. Click **Save**

5. Wait 1–2 minutes, then visit:
   ```
   https://YOUR-USERNAME.github.io/academic-halt/
   ```

> ⚠️ **Important for GitHub Pages:** The site is deployed at `/academic-halt/` not `/`. All internal links use root-absolute paths (`/css/style.css`, `/js/books-data.js`). These work correctly when your site is at a root domain, but if you're using the free `github.io/academic-halt/` subdirectory URL, the CSS and JS may not load.
>
> **Fix for GitHub Pages subdirectory:** Add this line to the `<head>` of `index.html`:
> ```html
> <base href="/academic-halt/">
> ```
> Or better — add a custom domain so the site serves from `/`.

6. **Add custom domain for GitHub Pages:**
   - In repository Settings → Pages → Custom domain → enter `www.academichalt.com`
   - Create a file named `CNAME` in the repo root containing just: `www.academichalt.com`
   - At your domain registrar, add a CNAME record: `www` → `YOUR-USERNAME.github.io`

---

## 🔑 CMS Setup — Step by Step

The CMS admin panel is at `/admin/`. It uses [Decap CMS](https://decapcms.org/) with GitHub as the backend.

### Step 1 — Edit config.yml

Open `admin/config.yml` and update line 6:

```yaml
backend:
  name: github
  repo: YOUR-GITHUB-USERNAME/academic-halt   # ← Change this
  branch: main
```

Push the change to GitHub.

### Step 2 — Create a GitHub OAuth App

1. Go to: [github.com/settings/developers](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   ```
   Application name:             Academic Halt CMS
   Homepage URL:                 https://www.academichalt.com
   Authorization callback URL:   https://www.academichalt.com/api/auth
   ```
4. Click **Register application**
5. Note your **Client ID** (shown immediately)
6. Click **Generate a new client secret** and note the secret

### Step 3 — Set up OAuth Proxy (for Cloudflare Pages)

Cloudflare Pages has a built-in way to handle this:

1. In Cloudflare Pages project → **Settings** → **Environment variables** → Add:
   ```
   GITHUB_CLIENT_ID     = your_client_id
   GITHUB_CLIENT_SECRET = your_client_secret
   ```

2. Create file `functions/api/auth.js` in your repo:
   ```javascript
   export async function onRequest(context) {
     // Cloudflare Pages OAuth proxy for Decap CMS
     const url = new URL(context.request.url);
     const code = url.searchParams.get('code');
     if (!code) {
       return Response.redirect(
         `https://github.com/login/oauth/authorize?client_id=${context.env.GITHUB_CLIENT_ID}&scope=repo`
       );
     }
     const resp = await fetch('https://github.com/login/oauth/access_token', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
       body: JSON.stringify({
         client_id: context.env.GITHUB_CLIENT_ID,
         client_secret: context.env.GITHUB_CLIENT_SECRET,
         code
       })
     });
     const data = await resp.json();
     const token = data.access_token;
     return new Response(
       `<script>window.opener.postMessage('authorization:github:success:${JSON.stringify({token,provider:"github"})}','*');window.close();</script>`,
       { headers: { 'Content-Type': 'text/html' } }
     );
   }
   ```

3. Update `admin/config.yml` to use `base_url`:
   ```yaml
   backend:
     name: github
     repo: YOUR-USERNAME/academic-halt
     branch: main
     base_url: https://www.academichalt.com
   ```

### Step 3 (Alternative) — Use Netlify for OAuth (Easier)

If the Cloudflare function above feels complex, the simplest OAuth solution:

1. Deploy a copy on [Netlify](https://netlify.com) (free tier, same repo)
2. Enable **Netlify Identity** → **Enable Git Gateway**
3. Change `admin/config.yml`:
   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```
4. Your CMS at `/admin/` will now use Netlify Identity for login

### Step 4 — Access the CMS

Navigate to: `https://www.academichalt.com/admin/`

You'll see the Decap CMS login screen. Click **Login with GitHub**.

Once logged in you can:
- ✅ **Add a new book** → Collections → Books → New Book
- ✅ **Edit** any book's title, PDF link, cover image, category
- ✅ **Delete** a book
- ✅ **Write blog posts** → Collections → Blog Posts → New Blog Post
- ✅ Every save **auto-commits** to your GitHub repo

---

### Local Development (Test CMS without GitHub)

```bash
# Terminal 1 — start local CMS proxy
npx decap-server

# Terminal 2 — serve the site
npx serve .
# OR
python3 -m http.server 8080
```

Enable local backend in `admin/config.yml`:
```yaml
local_backend: true
```

Visit `http://localhost:8080/admin/` — no login required locally.

> **Remember:** Disable `local_backend: true` before pushing to production.

---

## ✏️ Adding Books Manually (Without CMS)

### Method 1 — Edit books-data.js

Open `js/books-data.js` and add a new entry to the `BOOKS_DATA` array:

```javascript
{
  id: "unique-id-here",            // Must be unique across all books
  title: "Book Title Here",
  slug: "book-title-here",         // URL slug — must match your HTML filename
  category: "class-10",           // One of: class-9, class-10, class-11, class-12,
                                   //         jee-main, jee-advanced, neet, upsc
  categoryLabel: "Class 10",       // Human-readable label
  subject: "Mathematics",
  description: "Short description shown on book card (2-3 sentences).",
  pdfLink: "https://direct-link-to-pdf.com/file.pdf",
  coverImage: "",                  // URL to cover image or leave ""
  emoji: "📐",                    // Shown as placeholder when no cover image
  featured: false                  // Set true to show in homepage Popular Books
}
```

### Method 2 — Create the Book Detail Page

After adding to `books-data.js`, create the individual book page.

1. Copy an existing page as template:
   ```bash
   cp class-10/ncert-mathematics-class-10.html class-10/your-new-book.html
   ```

2. Edit the copy — update: `<title>`, `<meta name="description">`, `<h1>`, description text, FAQ answers, download button `href`

3. The file name **must exactly match** the `slug` in `books-data.js`:
   - slug: `"ncert-mathematics-class-10"` → file: `class-10/ncert-mathematics-class-10.html`

### Method 3 — Update Sitemap

After adding new pages, add them to `sitemap.xml`:

```xml
<url>
  <loc>https://www.academichalt.com/class-10/your-new-book.html</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 🔍 How Search Works

The search bar on the homepage searches all books in `books-data.js` instantly:

- Searches: title, subject, category, description
- Shows results as you type (after 2 characters)
- Press `Escape` to close results
- Press `Enter` to go to the first result
- Click any result to navigate to the book page

No server required — pure JavaScript, works offline.

---

## 📊 SEO Checklist

After deploying, complete these SEO steps:

1. **Submit sitemap** to Google:
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Add your property → Submit `https://www.academichalt.com/sitemap.xml`

2. **Submit to Bing**:
   - Go to [bing.com/webmasters](https://www.bing.com/webmasters)
   - Submit the same sitemap URL

3. **Verify meta tags** are correct on all pages (use browser DevTools → Elements → `<head>`)

4. **Check mobile rendering**:
   - Open browser DevTools → Toggle device toolbar (`Ctrl+Shift+M`)
   - Test at 375px (iPhone), 768px (iPad), 1280px (desktop)

5. **Test page speed**:
   - Visit [pagespeed.web.dev](https://pagespeed.web.dev)
   - Enter your homepage URL — aim for 90+ on both Mobile and Desktop

---

## 🎨 Customisation

### Change Colors
Edit the CSS variables at the top of `css/style.css`:
```css
:root {
  --primary:  #2563eb;   /* Main blue — change to your brand color */
  --accent:   #22c55e;   /* Green — used for download buttons */
  --secondary: #1e293b;  /* Dark — used for headings and footer */
}
```

### Add a New Category
1. Add category to `CATEGORIES` object in `js/books-data.js`
2. Create folder: `mkdir your-category`
3. Create `your-category/index.html` (copy from `class-9/index.html`, change `data-category`)
4. Add nav link to every page's header (find all `<li><a href="/upsc/">` lines)
5. Add to `admin/config.yml` category select options
6. Add to sitemap

### Change Fonts
Replace the Google Fonts URL in every HTML `<head>` and update the CSS variables:
```css
--font-display: 'YourFont', sans-serif;
--font-body:    'YourBodyFont', serif;
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styles | CSS3 (Grid, Flexbox, custom properties) |
| Scripts | Vanilla JavaScript (ES5 compatible) |
| Fonts | Google Fonts (Sora + Lora) |
| CMS | Decap CMS v3 (Git-based, no server) |
| Hosting | Cloudflare Pages or GitHub Pages |
| Build | None required — static files only |

---

## 📱 Responsive Breakpoints

| Breakpoint | Grid Layout |
|-----------|-------------|
| > 1024px (Desktop) | 3–4 columns |
| 768–1024px (Tablet) | 2 columns |
| 480–768px (Mobile) | 1–2 columns |
| < 480px (Small mobile) | 1 column |

---

**Academic Halt** — Free Books for Every Student 📚
