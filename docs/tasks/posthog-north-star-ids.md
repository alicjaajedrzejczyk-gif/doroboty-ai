# PostHog ids for the North Star metric (2026-11-24)

## Intent

Alice's North Star is unique interview invitations per week, counted once per candidate–job pair
(`application_stage_updated` with `new_stage = interview_invited`). Levers: jobs with an invitation
within 14 days of publication, and days from publication to the first invitation. Events lacked ids,
so pairs could not be deduplicated and publications could not be joined to invitations.

## Change

- `application_submitted`: `application_id`, `job_id`. The store's `run(action, newId)` now accepts
  the id the action creates, so the page knows the new application's id.
- `application_stage_updated`: `application_id`, `job_id`, `job_published_at`,
  `days_since_job_published`.
- `job_published`: `job_id`, `job_published_at`.

Ids are synthetic prototype identifiers (UUIDs or fixture ids), not personal data. No names or typed
text were added.

## Limits

Prototype data lives in each browser's localStorage and roles are simulated, so one person can act
as both candidate and employer. Seeded jobs never emit `job_published`; use `job_published_at` on the
stage event for lever 5. Separate own/test traffic in PostHog.
