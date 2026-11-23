# Production-readiness fixes (2026-11-18)

## Intent

Close the locally fixable gaps from the first production-readiness audit
(`docs/production-readiness.html`).

## Changes

- Browser tests could not start because Playwright Chromium was missing; it is now provisioned on
  this machine (no OS packages installed).
- Browser tests written before the "Co zrobiłem sam" card expected one textbox and a shorter
  keyboard order; they now cover the four optional card fields, which stay empty for legacy drafts.
- Record tabs (Odpowiedź / CV / Co zrobiłem sam) clipped the third tab at 320px. Below 420px the
  tabs shrink and their labels may wrap (`src/app/records.css`).
- Two open tabs could overwrite each other's saves. The store now listens to the `storage` event,
  adopts each valid saved scenario and keeps the tab's own selected persona
  (`src/features/prototype/store.tsx`). Unreadable values are ignored and never written back.

## Acceptance

- `./scripts/verify` passes, including the new browser test "a second open tab adopts saved
  changes instead of overwriting them".
- FEATURES.md SYS-09/SYS-10 describe same-browser tab sync.

## Not in scope

Committing/pushing and choosing a hosting provider need Alice's decision.
