# Small Business Website Template 🏪

A fast, modern, Cloudflare-ready small business website template with a built-in Turnstile-protected contact form.

Built with **Astro**, **Tailwind CSS**, **Cloudflare Pages**, and **Cloudflare Turnstile** — deploy in minutes, customize everything from a single config file.

## Who Is This For?

- Local service businesses (plumbers, electricians, cleaners, landscapers)
- Consultants and freelancers
- Agencies looking for a client starter template
- Contractors and tradespeople
- Medical/dental offices
- Real estate professionals
- Restaurants and cafes
- Anyone who needs a fast, professional business website without the complexity

## Features

- ✅ **Config-driven** — edit one file (`src/config/site.config.ts`) to customize everything
- ✅ **9 ready-made sections** — Hero, Services, Trust Bar, Why Choose Us, Testimonials, Gallery, About, Contact Form, Final CTA
- ✅ **Spam-protected contact form** — Cloudflare Turnstile + honeypot + server-side validation
- ✅ **Email forwarding** — form submissions sent directly to your inbox via Cloudflare Email Routing
- ✅ **SEO optimized** — Open Graph, Twitter Cards, LocalBusiness JSON-LD, sitemap, robots.txt
- ✅ **Accessible** — semantic HTML, skip-to-content, keyboard navigation, focus states, ARIA
- ✅ **Mobile-first** — responsive design that looks great on any device
- ✅ **Fast by default** — static-first, minimal client JS, optimized images
- ✅ **Privacy & thank-you pages** included
- ✅ **AI-ready** — `AGENTS.md` + `CLAUDE.md` for AI coding assistant integration
- ✅ **MIT licensed** — use it for anything

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | [Astro](https://astro.build) 5 |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3 |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) |
| Backend | Cloudflare Pages Functions |
| Spam protection | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| Validation | [Zod](https://zod.dev) |
| Email | Cloudflare Email Routing (`cloudflare:email` binding) |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [npm](https://npmjs.com)
- A [Cloudflare account](https://dash.cloudflare.com)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/small-business-site-template.git
cd small-business-site-template
npm install
```

### 2. Customize Your Content

Edit **`src/config/site.config.ts`** — this is where you change your business name, services, testimonials, contact info, and every section on the page.

```typescript
export const siteConfig = {
  businessName: "Your Business Name",
  tagline: "Your tagline here.",
  // ... everything else
};
```

### 3. Set Up Turnstile

1. Go to [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/sites/turnstile)
2. Add a new widget
3. Copy your **Site Key** and **Secret Key**
4. Copy `.env.example` to `.env` and paste your keys:

```
TURNSTILE_SITE_KEY=1x00000000000000000000AA0000000000000AAA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

> **For local development**, you can use the "always pass" test keys shown above. Real keys are only needed for production.

### 4. Set Up Email Forwarding

1. In Cloudflare Dashboard, go to **Email Routing → Email Workers**
2. Add the `send_email` binding — this is already configured in `wrangler.toml`
3. Verify your sender email address in **Email Routing → Settings**
4. Set these secrets (see deployment step below):

```
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=noreply@yourdomain.com
```

The sender email **must** be verified in Cloudflare Email Routing.

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:4321` — your site is running!

### 6. Deploy to Cloudflare Pages

```bash
# Set your secrets (one-time)
npx wrangler pages secret put TURNSTILE_SECRET_KEY
npx wrangler pages secret put TURNSTILE_SITE_KEY
npx wrangler pages secret put CONTACT_TO_EMAIL
npx wrangler pages secret put CONTACT_FROM_EMAIL

# Build and deploy
npm run pages:deploy
```

Alternatively, connect your GitHub repo to Cloudflare Pages for automatic deploys.

## Configuration Guide

### Site Config (`src/config/site.config.ts`)

The entire site is driven by this single file. Here's what each section controls:

| Section | Description |
|---------|-------------|
| `businessName` | Appears in the logo, footer, and SEO title |
| `contact` | Phone, email, address, business hours |
| `hero` | Headline, subheadline, primary and secondary CTAs |
| `trustItems` | Badges like "Locally Owned", "5-Star Rated" |
| `services` | Array of service cards with title, description, icon |
| `whyChooseUs` | Differentiators that set you apart |
| `testimonials` | Customer quotes with name, location, rating |
| `gallery` | Optional portfolio/project images (can be disabled) |
| `about` | Business story, years of experience, owner photo |
| `finalCta` | Call-to-action banner before the footer |
| `footer` | Navigation links, description, legal pages |
| `socialLinks` | Google Business, Facebook, Instagram, LinkedIn, X, YouTube |
| `seo` | OG image, Twitter handle |
| `business` | LocalBusiness schema (type, area served, price range) |

### Icons

The template uses emoji icons for service cards. Change the `icon` field in each service to one of:

- `Home` 🏠 — Residential
- `Building2` 🏢 — Commercial
- `Clock` ⏰ — Time/emergency
- `ShieldCheck` 🛡️ — Guarantee/trust
- `MessageSquare` 💬 — Communication
- `Wrench` 🔧 — Service/maintenance

To use SVG icons instead, edit `src/components/Services.astro`.

### Gallery

Gallery is disabled by default. To enable it, set `gallery.enabled: true` in `site.config.ts` and add your images to the `gallery.items` array. Images should be placed in `public/images/gallery/`.

## AI-Assisted Development

This template includes agent instruction files for AI coding assistants (Claude Code, Codex CLI, Cursor, Copilot, etc.).

### `AGENTS.md` (cross-tool)

The canonical source of truth read by most AI coding tools. Covers project overview, tech stack, commands, deployment workflow, customization guide, code conventions, architecture rules, and agent behavior guidelines.

### `CLAUDE.md` (Claude Code)

Imports `AGENTS.md` and adds Claude Code-specific conventions (plan mode, auto memory, skills, hooks). Both tools see the same instructions without duplication.

### How to use with AI tools

| Tool | What it reads | Notes |
|------|--------------|-------|
| Claude Code | `CLAUDE.md` (and by extension `AGENTS.md`) | Loads automatically at session start |
| Codex CLI | `AGENTS.md` | Reads on project initialization |
| Cursor | `.cursorrules` (create from `AGENTS.md`) | Symlink or copy |
| Copilot | `.github/copilot-instructions.md` (create from `AGENTS.md`) | Required for Copilot context |

### Keeping instructions up to date

When you add a new command, change the tech stack, or update deployment steps, edit **`AGENTS.md`** — it's the single source. `CLAUDE.md` pulls from it via the `@AGENTS.md` import syntax, so it stays in sync automatically.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TURNSTILE_SITE_KEY` | Yes | Public key for Turnstile widget (frontend) |
| `TURNSTILE_SECRET_KEY` | Yes | Secret key for Turnstile verification (server) |
| `CONTACT_TO_EMAIL` | Yes | Where to send contact form leads |
| `CONTACT_FROM_EMAIL` | Yes | Verified sender email in Cloudflare Email Routing |
| `ALLOWED_ORIGIN` | No | Restrict CORS to a specific domain in production |

## Project Structure

```
small-business-site-template/
├── src/
│   ├── config/
│   │   └── site.config.ts        ← Edit this to customize your site
│   ├── components/
│   │   ├── Hero.astro            ← Hero section
│   │   ├── TrustBar.astro        ← Trust indicators
│   │   ├── Services.astro        ← Service cards
│   │   ├── WhyChooseUs.astro     ← Differentiators
│   │   ├── Testimonials.astro    ← Customer reviews
│   │   ├── Gallery.astro         ← Portfolio images
│   │   ├── About.astro           ← Business story
│   │   ├── ContactForm.astro     ← Turnstile form + validation
│   │   ├── FinalCTA.astro        ← Bottom call-to-action
│   │   ├── Navbar.astro          ← Responsive navigation
│   │   ├── Footer.astro          ← Footer with social links
│   │   └── SEO.astro             ← Meta tags + structured data
│   ├── layouts/
│   │   └── BaseLayout.astro      ← HTML shell
│   ├── lib/
│   │   ├── schema.ts             ← Zod schemas (shared types)
│   │   ├── seo.ts                ← JSON-LD helpers
│   │   ├── turnstile.ts          ← Turnstile verification
│   │   └── utils.ts              ← Formatting utilities
│   ├── pages/
│   │   ├── index.astro           ← Homepage
│   │   ├── privacy.astro         ← Privacy policy
│   │   ├── thank-you.astro       ← Post-submission page
│   │   └── 404.astro             ← Custom 404
│   └── styles/
│       └── global.css            ← Tailwind + base styles
├── functions/
│   └── api/
│       └── contact.ts            ← Contact form endpoint (Zod + Turnstile + Email)
├── email/
│   ├── provider.ts               ← Email provider interface
│   ├── cloudflare.ts             ← Cloudflare email adapter
│   └── templates/
│       ├── lead-text.txt         ← Plain text email template
│       └── lead-html.html        ← HTML email template
├── public/
│   ├── robots.txt
│   └── images/
├── wrangler.toml                 ← Cloudflare Pages config
├── astro.config.mjs              ← Astro configuration
├── tsconfig.json
├── .env.example                  ← Environment variable template
├── AGENTS.md                     ← AI agent instructions (cross-tool)
├── CLAUDE.md                     ← Claude Code instructions (imports AGENTS.md)
└── package.json
```

## Roadmap

- [x] Config-driven homepage
- [x] Responsive 9-section layout
- [x] Turnstile-protected contact form
- [x] Cloudflare email forwarding
- [x] SEO + JSON-LD structured data
- [x] Accessibility
- [ ] Industry presets (contractor, medical, real estate, restaurant)
- [ ] Blog support
- [ ] Services detail pages
- [ ] Project/case study pages
- [ ] Google Reviews embed
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Resend / SendGrid / Mailgun email adapters

## Contributing

Contributions welcome! Please open an issue or PR on GitHub.

## License

MIT — use it for personal or commercial projects.
