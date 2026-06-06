# Post Link

A clean React/Vite landing page starter for **Post Link**, a social media scheduling product inspired by the broad category of cross-posting tools.

This is intentionally not a pixel-for-pixel copy of Post Bridge. It uses original copy, layout, naming, and styling while keeping a similar product positioning: upload once, adapt per platform, schedule everywhere.

## What is included

- Responsive landing page
- Hero section with dashboard mockup
- Supported platform section
- Feature cards
- How-it-works section
- Automation/API positioning section
- Pricing cards
- FAQ

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Build

```bash
npm run build
```

## Main files

```text
index.html
src/main.jsx
src/styles.css
package.json
```

## Suggested next steps

1. Replace the early-access `mailto:` links with real routes.
2. Add authentication.
3. Add a dashboard page.
4. Add platform connection flow.
5. Add backend scheduling queue.
6. Add billing.
7. Add API integrations for each platform.

## Backend ideas

Recommended stack:

- Frontend: React / Vite or Next.js
- Backend: Node.js / NestJS or Next.js API routes
- Database: PostgreSQL
- Queue: BullMQ + Redis
- Auth: Clerk, Auth.js, or Supabase Auth
- Billing: Stripe
- Hosting: Vercel for frontend, Hetzner/Fly.io/Render for worker services

## Important note

Actual social publishing requires official platform APIs, account permissions, and compliance with each platform's rules. The current project is a polished front-end starter only.
