# Academic Halt

> **Free Books & Study Materials for Students**  
> https://www.academichalt.com

Academic Halt is a free educational platform providing PDF books and study materials for students preparing for Class 9–12 board exams, JEE Main, JEE Advanced, NEET, and UPSC.

---

## 📁 Repository Structure

```
academic-halt/
│
├── index.html                    # Homepage
├── about.html                    # About page
├── contact.html                  # Contact page
├── privacy-policy.html           # Privacy policy
├── terms.html                    # Terms of use
├── robots.txt                    # SEO robots file
├── sitemap.xml                   # XML sitemap
├── _redirects                    # Cloudflare/Netlify redirects
│
├── /class-9/                     # Class 9 category page
│   └── index.html
├── /class-10/
│   └── index.html
├── /class-11/
│   └── index.html
├── /class-12/
│   └── index.html
├── /jee-main/
│   └── index.html
├── /jee-advanced/
│   ├── index.html
│   └── hc-verma-concepts-of-physics.html  # Sample book page
├── /neet/
│   └── index.html
├── /upsc/
│   └── index.html
│
├── /blog/
│   ├── index.html
│   ├── best-books-for-jee-main.html
│   ├── best-books-for-neet.html
│   ├── best-books-for-upsc.html
│   └── study-tips-for-board-exams.html
│
├── /admin/
│   ├── index.html                # Decap CMS admin panel
│   └── config.yml                # CMS configuration
│
├── /content/
│   ├── /books/                   # Book markdown files (managed by CMS)
│   │   ├── ncert-mathematics-class-10.md
│   │   └── hc-verma-concepts-of-physics.md
│   └── /blog/                    # Blog post markdown files
│       └── best-books-for-jee-main.md
│
├── /assets/
│   ├── logo.svg
│   └── /book-covers/             # Uploaded book cover images
│
├── /css/
│   └── style.css                 # Complete stylesheet
│
├── /js/
│   ├── books-data.js             # Static books database
│   ├── script.js                 # Main JavaScript
│   └── search.js                 # Live search system
│
└── /components/
    ├── header.html               # Reusable header snippet
    └── footer.html               # Reusable footer snippet
```

---

## 🚀 Deployment

### Option 1 — GitHub Pages

1. **Fork or push this repository to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Academic Halt"
   git remote add origin https://github.com/YOUR-USERNAME/academic-halt.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` → Folder: `/ (root)`
   - Click **Save**

3. **Your site will be live at:**
   ```
   https://YOUR-USERNAME.github.io/academic-halt/
   ```

4. **Custom Domain (optional)**
   - Add `CNAME` file with your domain: `www.academichalt.com`
   - Configure DNS: Add a CNAME record pointing `www` to `YOUR-USERNAME.github.io`

---

### Option 2 — Cloudflare Pages (Recommended)

Cloudflare Pages is faster than GitHub Pages and offers better edge caching.

1. **Push your repository to GitHub** (see step 1 above)

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Pages** → **Create a project** → **Connect to Git**
   - Select your repository

3. **Build Settings**
   ```
   Framework preset:   None
   Build command:      (leave empty)
   Build output dir:   /
   Root directory:     /
   ```

4. **Deploy** — Cloudflare will deploy your site automatically.

5. **Custom Domain**
   - In Cloudflare Pages project → **Custom domains** → Add `www.academichalt.com`
   - Cloudflare handles DNS automatically if your domain is on Cloudflare

---

## 🔑 CMS Setup (Decap CMS)

The admin dashboard is available at `/admin/` after deployment.

### Step 1 — Configure the Backend

Open `admin/config.yml` and replace the placeholder with your details:

```yaml
backend:
  name: github
  repo: YOUR-GITHUB-USERNAME/academic-halt   # ← Replace this
  branch: main
```

### Step 2 — Enable GitHub OAuth

Decap CMS requires GitHub OAuth to authenticate. You have two options:

#### Option A — Netlify Identity (Easiest)
If you deploy via Netlify:
1. Enable **Netlify Identity** in your site settings
2. Enable **Git Gateway** under Identity settings
3. Change the backend in `config.yml`:
   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```

#### Option B — GitHub OAuth App (For GitHub Pages / Cloudflare)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**
2. Fill in:
   ```
   Application name:     Academic Halt CMS
   Homepage URL:         https://www.academichalt.com
   Authorization callback URL: https://api.netlify.com/auth/done
   ```
3. Note your **Client ID** and generate a **Client Secret**
4. Use a proxy authentication server (e.g. `netlify/netlify-cms-oauth-provider-node`) or use [Decap CMS's external OAuth guide](https://decapcms.org/docs/external-oauth-clients/)

### Step 3 — Access the CMS

Navigate to: `https://www.academichalt.com/admin/`

Log in with your GitHub account. The CMS will let you:
- ✅ Add new books
- ✅ Edit existing books
- ✅ Delete books
- ✅ Upload PDF links
- ✅ Upload cover images
- ✅ Set category (Class 9–12, JEE, NEET, UPSC)
- ✅ Mark books as Featured
- ✅ Write and manage blog posts

Every save in the CMS automatically commits to your GitHub repository.

### Local Development (CMS)

For local testing of the CMS without authentication:

1. Enable local backend in `admin/config.yml`:
   ```yaml
   local_backend: true
   ```

2. Run the local proxy server:
   ```bash
   npx decap-server
   ```

3. Open `http://localhost:8080/admin/` in your browser

---

## ✏️ Adding Books Manually

If you prefer not to use the CMS, you can add books directly to `js/books-data.js`:

```javascript
{
  id: "unique-id",
  title: "Book Title",
  slug: "book-slug",
  category: "class-10",           // class-9, class-10, class-11, class-12,
                                   // jee-main, jee-advanced, neet, upsc
  categoryLabel: "Class 10",
  subject: "Mathematics",
  description: "Short description of the book.",
  pdfLink: "https://example.com/book.pdf",
  coverImage: "",                  // URL to cover image, or leave empty
  emoji: "📐",                    // shown when no cover image
  featured: true                   // show in homepage "Popular Books"
}
```

Then create a corresponding book detail HTML page in the relevant category folder (use `jee-advanced/hc-verma-concepts-of-physics.html` as a template).

---

## 🔍 Search System

The search system (`js/search.js`) works automatically — it searches all books in `js/books-data.js` by:
- Book title
- Subject
- Category
- Description

The search appears in the homepage hero section and shows instant results as you type.

---

## 📊 SEO

Each page includes:
- Meta title and description
- Canonical URL
- Open Graph tags
- Schema.org structured data (Organization, BreadcrumbList, Article, Book)
- Proper H1/H2/H3 heading hierarchy
- Internal linking between pages
- `robots.txt` allowing all crawlers
- `sitemap.xml` listing all pages

After deployment, submit your sitemap to:
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Color | `#2563eb` |
| Secondary Color | `#1e293b` |
| Accent Color | `#22c55e` |
| Background | `#ffffff` |
| Surface | `#f8fafc` |
| Border | `#e2e8f0` |
| Text | `#0f172a` |
| Font (Headings) | Sora |
| Font (Body) | Lora |
| Border Radius | `8px` |

---

## 📱 Responsive Breakpoints

| Screen | Grid |
|--------|------|
| Desktop (> 1024px) | 3–4 columns |
| Tablet (768–1024px) | 2 columns |
| Mobile (< 768px) | 1 column |

---

## 🛠️ Technology Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — No frameworks or build tools required
- **Decap CMS** — Git-based headless CMS
- **Google Fonts** — Sora + Lora typography

---

## 📄 License

The website code is open source for educational use. All book PDFs remain the intellectual property of their respective authors and publishers.

---

## 🤝 Contributing

1. Fork the repository
2. Add new books to `js/books-data.js`
3. Add corresponding book detail pages
4. Submit a pull request

---

**Academic Halt** — Free Books for Every Student 📚
