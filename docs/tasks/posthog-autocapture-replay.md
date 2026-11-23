# PostHog autocapture and session replay with private areas

## Intent and acceptance

Turn on PostHog autocapture (so a button click is recorded without a per-button event) and session replay, while keeping everything users type or see as private out of PostHog.

- Autocapture: clicks on `a` and `button` only; no change/submit events, no field values, no copied text, no `href` attribute (hash links can carry search text).
- Session replay: on, all inputs masked, console logs off.
- One marker, `data-private`, on UI that shows or collects private free text: persona names (workspace label, header link, welcome title, person picker), profile preview and form, application form, application list, application record (answers, CV, self-work, notes), CV attachment (the PDF iframe also has `ph-no-capture`), search filter chips, and the list/map and pagination links while a search query is active.
- Autocapture ignores `[data-private]`; replays block it (blank box). Masking was not enough: rrweb masks text but keeps attributes such as `aria-label="Usuń filtr: <query>"` and the CV file name in `href`.
- Privacy page (Polish UI) now says the published site uses PostHog (EU) for pageviews, clicks and masked recordings.
- Test button: „Zobacz oferty” on the home page (public, no personal data, visible without choosing a persona).

PostHog project settings already allow autocapture and replay; the code decides. `recording_domains` is empty, so local runs with a `.env` and Netlify deploy previews would also record.

## Validation

- Unit tests in `src/lib/posthog.test.ts` pin the autocapture and replay options.
- Browser check with a fake local PostHog (local sink serving config and the recorder; nothing sent to PostHog): home → „Zobacz oferty” → search „tajnyteksttestowy” → remove chip → choose Anna Kowalska → profile preview → applications. Autocapture sent `Zobacz oferty` and `Szukaj` only (chip and person-picker clicks ignored). Decompressed replay snapshots contained public text („Dobra robota”, „Zobacz oferty”) and 30 blocked placeholders, and none of: the search text, „Anna”, „Kowalska”, the bio, the profile headline, the CV file name, „Usuń filtr”. The first run (text masking only) leaked the search text and CV file name through attributes, which led to blocking.
- `./scripts/verify` result is recorded in the PR description.
