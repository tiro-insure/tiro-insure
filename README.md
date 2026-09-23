# TIRO digital platform

Astro build for the TIRO funeral cover and tombstone platform. It includes the branded public experience, guided funeral-cover discovery, a live Supabase-backed tombstone catalogue, and secure application/order handoff endpoints.

Payments are deliberately not connected yet. Applications, orders and custom-design requests are held only in the browser, then delivered to a configured secure webhook when one exists or to the approved TIRO inbox through Resend. No customer application, banking or payment information is stored in Supabase.

For the demo, when those specialised webhooks are not configured, enquiries are delivered server-side through Resend to the fixed TIRO inbox. The temporary sender is `onboarding@resend.dev`; replace it with a verified TIRO domain before a public launch.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and add the public Supabase URL and publishable key (the local `.env` is ignored by Git).
3. Run `npm run dev`, then open `http://localhost:4321`.
4. Run `npm run check` and `npm run build` before a handoff or deployment.

Changing `.env` requires restarting the dev server.

On this Windows machine, start the local server with `$env:NODE_OPTIONS='--use-system-ca'; npm run dev` so Node can validate the local network certificate chain when delivering email.

The master prompt is the build specification. The TIRO developer kit and Web CI/UI Guide supply supporting brand assets, tokens and approved copy. Their reference posters are not site imagery. The brand SVGs in `public/brand` are development traces; replace them with official master vectors before production if supplied.

Reference documents and the tombstone brochure are kept in the ignored `project-reference/` folder so they are not served as public web assets or committed by default.

## Live Supabase content

The connected Supabase project contains a protected public-content schema:

- 25 published tombstone products, 25 matching image paths and 7 active categories, sourced from the supplied 2026 brochure.
- 10 catalogue records retain the brochure’s `A/P` or `T/P` labels and are marked `needs_review`; no numeric current price has been inferred for them.
- Six unpublished funeral-cover placeholders, with no invented pricing, eligibility or policy wording.
- Public visitors can read published/active content only. Admin mutations require a signed-in user whose ID has an `admin_roles` record. Every `public` table has Row Level Security enabled.

To turn on CMS editing, create the intended editor in Supabase Auth, then grant that user an `admin` or `editor` record in `public.admin_roles`. Do not expose the Supabase secret key in the browser.

## Source data boundaries

- The six funeral cover products in the brief are still placeholders. No prices or eligibility terms have been invented.
- `products.json` from the source folder contains other insurance plans and is not imported into the funeral cover catalogue.
- The 2026 tombstone brochure is seeded with its price labels preserved exactly. Any uncertain values remain marked for review.
- No application, payment, or customer record is stored by this build.

## Next build steps

Create the first Supabase Auth administrator, obtain the approved application/order webhook contracts, then add those server-only secrets to Vercel. Connect a payment provider only after its product, checkout and compliance requirements are approved.
