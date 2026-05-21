# Claude Code Instructions for SMB Site Template

This file imports the canonical agent instructions from AGENTS.md and adds Claude-specific conventions.

@AGENTS.md

## Claude-Specific Conventions

- **Use plan mode** for structural changes (new components, page routes, email templates) before writing code
- **Auto memory** is enabled for this project — Claude saves build commands, debugging insights, and preferences automatically
- **Run `npx astro check`** after any TypeScript/Astro component changes to catch type errors early
- **Skills** can be created for repeatable workflows: `/customize-site`, `/add-service`, `/deploy`
- **Hooks** are not configured yet — if you need pre/post commit hooks, use `.claude/hooks/`

## Quick Reference

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run pages:deploy  # Deploy to Cloudflare Pages
npm test              # Run tests
```
