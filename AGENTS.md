# SMB Site Template — AI Agent Instructions

## Project Overview

A fast, modern, Cloudflare-ready small business website template with a built-in Turnstile-protected contact form. Designed for local service businesses, consultants, freelancers, and agencies.

## Tech Stack

- **Framework:** Astro 5 (SSR mode — `output: "server"`)
- **Hosting/Backend:** Cloudflare Pages + Pages Functions
- **Styling:** Tailwind CSS 3
- **Validation:** Zod (shared schemas in `src/lib/schema.ts`)
- **Spam protection:** Cloudflare Turnstile (frontend widget + server-side verification)
- **Email:** Cloudflare Email Routing via `cloudflare:email` binding
- **Testing:** Vitest + `@cloudflare/vitest-pool-workers`
- **TypeScript:** Strict mode, targeting ES2022

## Project Structure

```
src/
├── config/site.config.ts       ← Single config file — edit this to customize the site
├── components/                 ← Astro components (Hero, Services, ContactForm, etc.)
├── layouts/BaseLayout.astro    ← HTML shell with SEO + structured data
├── lib/                        ← Shared utilities (Zod schemas, SEO, Turnstile, utils)
├── pages/                      ← Routes (index, privacy, thank-you, 404)
├── styles/global.css           ← Tailwind directives + base styles
functions/api/contact.ts        ← Contact form handler (server endpoint)
email/                          ← Email provider + templates (HTML + plain text)
public/                         ← Static assets (images, robots.txt, favicon)
```

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start local dev server on `localhost:4321` |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run pages:dev` | Run locally with Cloudflare Pages Functions (Wrangler) |
| `npm run pages:deploy` | Build + deploy to Cloudflare Pages |
| `npm test` | Run Vitest suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run cf-typegen` | Regenerate Cloudflare worker types |
| `npx astro check` | Run Astro type + lint checks |

## Deployment

### Via Wrangler CLI

```bash
# One-time secrets setup
npx wrangler pages secret put TURNSTILE_SECRET_KEY
npx wrangler pages secret put TURNSTILE_SITE_KEY
npx wrangler pages secret put CONTACT_TO_EMAIL
npx wrangler pages secret put CONTACT_FROM_EMAIL

# Build and deploy
npm run pages:deploy
```

### Via Cloudflare MCP (AI agent deployment)

If your AI coding environment has the **Cloudflare MCP** server configured (`https://mcp.cloudflare.com/mcp` with OAuth), you can deploy directly from your agent:

1. **Authenticate** — the Cloudflare MCP uses OAuth. Run `cloudflare_mcp_authenticate` (or equivalent) in your agent session. This opens a browser to authorize your Cloudflare account. The session stores the token for the duration of the conversation.

2. **Create or update the Pages project** — use the Cloudflare MCP to create a Pages project linked to your GitHub repo, or use the direct upload method.

3. **Set secrets** — use the Cloudflare MCP to set the required environment variables (secrets) on your Pages project:
   - `TURNSTILE_SECRET_KEY`
   - `TURNSTILE_SITE_KEY`
   - `CONTACT_TO_EMAIL`
   - `CONTACT_FROM_EMAIL`

4. **Trigger a deploy** — push to the `main` branch (auto-deploys if Git integration is set up) or use the Cloudflare Builds MCP to trigger a manual deployment.

**Prerequisites:** The Cloudflare MCP must be configured in your AI tool's MCP settings:
```json
{
  "mcpServers": {
    "cloudflare": {
      "url": "https://mcp.cloudflare.com/mcp",
      "auth": "oauth"
    }
  }
}
```

> When an AI agent has the Cloudflare MCP available, it can handle the entire deploy workflow. Just ask: **"Deploy this site to Cloudflare Pages"** and the agent will authenticate, set up the project, configure secrets, and push it live.

## How to Customize the Site

**Everything is driven by `src/config/site.config.ts`.** Edit that single file to change:
- Business name, tagline, description, URL
- Contact info (phone, email, address, hours)
- Hero section (headlines, CTA buttons)
- Trust bar items
- Service cards (title, description, icon, optional link)
- Why Choose Us differentiators
- Testimonials (quote, name, location, rating)
- Gallery (enable/disable, images in `public/images/gallery/`)
- About section
- Final CTA banner
- Footer navigation + social links
- SEO settings (OG image, Twitter handle)
- LocalBusiness JSON-LD schema (type, area served, price range)

**Icons** for service cards are emoji-based: `Home`, `Building2`, `Clock`, `ShieldCheck`, `MessageSquare`, `Wrench`. To use SVG icons instead, edit `src/components/Services.astro`.

**Environment variables** (copy `.env.example` to `.env`):
- `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile keys
- `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` — Email forwarding (FROM must be verified in Cloudflare Email Routing dashboard)
- `ALLOWED_ORIGIN` — Optional CORS restriction for production

## Code Conventions

- **TypeScript strict mode** — always type exports and function signatures
- **Zod schemas** in `src/lib/schema.ts` are the source of truth for data shapes — reuse them for validation, don't duplicate types manually
- **Astro components** use `.astro` extension (not `.tsx`/`.jsx`)
- **CSS** uses Tailwind utility classes directly in Astro markup — avoid custom CSS unless necessary
- **Server-side logic** goes in `functions/api/` (Pages Functions) — not in Astro component scripts
- **Client JS** is minimal — prefer Astro island pattern (`client:load` / `client:idle`) when adding interactivity
- **Email templates** go in `email/templates/` — both HTML and plain text versions required

## Architecture Rules

- `src/config/site.config.ts` is the **single source of truth** for content — do not hardcode business-specific text in components
- Components receive content via imports from `site.config.ts` or via props — never mix concerns
- Contact form flow: Turnstile widget (frontend) → POST `/api/contact` → Zod validation → Turnstile verification (server) → Email forwarding via binding
- Pages Functions use Cloudflare `context.env` bindings — do not use `process.env` in the browser bundle path
- SEO is handled by `src/components/SEO.astro` and `src/lib/seo.ts` — always include both for new pages

## Testing

- Tests use Vitest with `@cloudflare/vitest-pool-workers`
- Run `npm test` before creating PRs
- Test files go alongside source or in `tests/` directory
- Use Cloudflare's `SELF` pattern to test Pages Functions endpoints

## Agent Behavior

1. **Plan first** — before writing code, read and understand the existing structure. This project is config-driven — look at `site.config.ts` before modifying components.
2. **Prefer configuration over code changes** — most customizations should be done by editing `site.config.ts`, not by modifying components.
3. **Keep the email flow intact** — the Turnstile → Zod → Email chain must remain unbroken. Don't bypass Turnstile verification.
4. **Maintain SSR compatibility** — Astro is configured for server output. Don't assume static generation unless verified.
5. **Test before committing** — run `npm test` and verify `npm run build` succeeds.
6. **Use `npx astro check`** for type/lint validation before asking for review.
