# PostHog product analytics (PR #1 review fixes)

## Intent and acceptance

The PostHog cloud wizard opened PR #1 with posthog-js, @posthog/react and explicit product events. Review against the case rules found four problems, fixed here on the same branch:

1. Privacy: PostHog project settings enable session replay, autocapture, console logs and heatmaps. The SDK now switches recording, autocapture, rage/dead clicks, heatmaps and surveys off explicitly (`src/lib/posthog.ts`).
2. No person profiles: the wizard called `posthog.identify(person.id, { name, role })` on persona switch. Removed; `person_profiles: "never"` keeps events anonymous. Personas are a role simulation, not users.
3. Participant setup: `npm run dev` threw in development when the PostHog variables were missing, leaving a blank page. A missing key now simply disables analytics.
4. Hash routes: `defaults: "2026-08-30"` only captures pageviews on pathname changes and strips URL hashes (`disable_capture_url_hashes`), while HashRouter keeps the pathname at `/`, so only the first pageview was sent. Turning hash capture on would leak search text (`#/oferty?query=...`). Instead `capture_pageview: false` and `PosthogPageviews` (inside HashRouter) sends one `$pageview` per route with `$current_url = origin/#/<path>` and no query string.

Also: one shared `posthogConfigured` flag instead of eight copies, the wizard's dependency re-sort and duplicate `.env` ignore line reverted, FEATURES.md SYS-03/OPS-11 updated.

Event properties stay free-text free (booleans, categories, counts, stages). Production needs `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com` in Netlify; they are build-time variables, so a redeploy is needed after setting them.

## Validation

- Unit tests: `src/lib/posthog.test.ts` pins the privacy options and the route-only pageview properties.
- Browser check (Node 24, dev server, no PostHog variables): home and offers render, no console errors.
- Browser check with a fake local PostHog host and a local request sink (no data sent to PostHog): navigating `#/` → `#/oferty` → search „tajnyteksttestowy” → `#/metodologia`, and opening `#/oferty?query=tajnyteksttestowy` directly, produced `$pageview` for `#/`, `#/oferty`, `#/metodologia` and `job_search_submitted` with `has_query: true`; the search text appeared in no payload; `$process_person_profile: false`; no `/s/` recording requests.
- `./scripts/verify` result is recorded in the PR comment.
