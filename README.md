# rodfer.me

Personal portfolio of **Rodrigo Fernández**, full-stack software engineer.
A trilingual, statically-rendered site with a live availability status and a
working contact form, running on Cloudflare Pages.

🔗 **Live:** [rodfer.me](https://rodfer.me)

## Features

- **Trilingual** — English, Spanish and Catalan, via Astro's i18n routing
  (`/`, `/es/`, `/ca/`).
- **Light / dark theme** — follows the OS preference and reacts to it live,
  with a manual toggle that takes precedence once used.
- **Live availability badge** — a KV-backed status (`available` / `busy` /
  `unavailable`) that updates at runtime with no redeploy, plus distinct
  `empty` and `notfound` fallback states.
- **Contact form** — multi-select service categories, a honeypot, and email
  delivery through the Resend API.

## Tech stack

- [Astro 6](https://astro.build) — `output: static`
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- TypeScript
- [Cloudflare Pages](https://pages.cloudflare.com) + Pages Functions
- [Cloudflare KV](https://developers.cloudflare.com/kv/) — availability state
- [Resend](https://resend.com) — contact form email
- pnpm

## Project structure

```text
├── functions/api/        Cloudflare Pages Functions
│   ├── availability.ts   Availability status (KV-backed)
│   └── contact.ts        Contact form → Resend
├── src/
│   ├── components/       Hero, Nav, Services, About, Contact
│   ├── i18n/             ui.ts (translations) + helpers
│   ├── layouts/          BaseLayout
│   ├── pages/            index.astro, es/, ca/
│   └── styles/           global.css (theme variables)
└── wrangler.toml         Pages configuration
```

## Local development

Requires **Node.js 22.x** and **pnpm**.

```sh
pnpm install
```

There are two ways to run the site locally, because the `/api/*` routes are
Cloudflare Pages Functions:

| Command | Serves | URL | Notes |
| :------ | :----- | :-- | :---- |
| `pnpm dev` | the Astro site only | `localhost:4321` | Fast HMR. `/api/*` returns 404 — the availability badge will show its `notfound` state. |
| `pnpm build && pnpm pages:dev` | site **+** functions **+** local KV | `localhost:8788` | Needed to exercise the `/api/*` routes and the contact form. Rebuild to pick up changes. |

## Deployment

Hosted on **Cloudflare Pages** with Git integration — every push to `master`
runs `pnpm build` and deploys automatically. The `functions/` directory is
picked up as Pages Functions, and the KV namespace binding is read from
`wrangler.toml`.

## License

© Rodrigo Fernández. This is a personal project — the code is public to view,
but not licensed for reuse.
