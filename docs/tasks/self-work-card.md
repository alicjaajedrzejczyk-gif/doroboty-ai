# „Co zrobiłem sam” card in the application

## Intent and acceptance

Supersprint Test A showed that recruiters cannot tell before the interview what a candidate did personally; most AI-assisted answers lack a result. Add an optional four-field card to the candidate application form: Projekt, Moja część, Rezultat, Czy rozwiązanie było używane?. Store it with the draft and the immutable submitted application. Show it to the employer (and the candidate) as a separate „Co zrobiłem sam” tab after Odpowiedź and CV; empty fields read „brak informacji”, which is itself a signal. Legacy stored/imported state without the fields must stay valid (fields default to empty strings).

## Validation

- Unit test covers storing all four fields and defaulting legacy records; the legacy-draft e2e fixture keeps omitting the new fields.
- Manual browser check on http://127.0.0.1:3001: filled three fields as Anna, submitted, switched to Karolina (BrightLabs) and saw the card with „brak informacji” for the empty usage field. Test application removed afterwards.
- Passed under Node 24: format:check, design-system:check, lint, typecheck, 28 unit tests, verify:packet, build, git diff --check.
- Not run: Playwright browser journeys (`test:e2e`), because Playwright Chromium is not provisioned on this machine.
