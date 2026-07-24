# Triple III Window Tint

Astro website prepared for Cloudflare Pages with Sanity content management and phone/SMS booking.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env`.
3. Run `npm run dev`.

The public site uses phone and SMS as its only customer contact methods.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Runtime: Cloudflare Pages/Workers via `@astrojs/cloudflare`

Add the variables from `.env.example` in the Cloudflare dashboard. The site is connected to Sanity project `o7039w6t`; published changes are fetched on the next page request.

## Content editor

Run `npm run studio` to launch the connected editor locally. Use `npm run studio:deploy` to publish the authenticated editor after choosing its public Studio hostname.
