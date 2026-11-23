# PostHog click autocapture with private areas

## Intent and acceptance

Turn on PostHog autocapture so a button or link click is recorded without a per-button event, while keeping everything users type or see as private out of PostHog. Session replay was prototyped on this branch and then dropped at the owner's request; it stays off in code.

- Autocapture: clicks on `a` and `button` only; no change/submit events, no field values, no copied text, no `href` attribute (hash links can carry search text, e.g. `#/oferty?query=...`).
- `data-private` marks UI that shows or collects private free text: persona names (workspace label, header link, welcome title, person picker), profile preview and form, application form, application list, application record (answers, CV, self-work, notes), CV attachment (the PDF iframe also has `ph-no-capture`), and the search filter chips (their `aria-label` contains the query). Autocapture ignores clicks inside it.
- Session replay stays disabled in code although the PostHog project setting allows it.
- Privacy page (Polish UI) now says the published site uses PostHog (EU) for pageviews and clicks and does not record visits.
- Test button: „Zobacz oferty” on the home page (public, no personal data, visible without choosing a persona).

## Validation

- Unit tests in `src/lib/posthog.test.ts` pin the autocapture options and that replay is off.
- Browser check with a fake local PostHog (local request sink; nothing sent to PostHog): home → „Zobacz oferty” → search „tajnyteksttestowy” → remove chip → choose Anna Kowalska. Autocapture sent `Zobacz oferty` and `Szukaj` only; chip and person-picker clicks were ignored; the search text and persona name appeared in no event.
- `./scripts/verify` result is recorded in the PR description.
