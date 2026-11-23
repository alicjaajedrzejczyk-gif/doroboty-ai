import posthog, { type PostHogConfig } from "posthog-js";

const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

/** Analytics run only when both variables are set (Netlify production or a local .env). */
export const posthogConfigured = Boolean(token && host);

/**
 * Marks UI that shows or collects private free text (names, profile, application, CV,
 * notes, search filters). Autocapture ignores clicks inside it and replays show it as a blank box.
 */
export const PRIVATE_SELECTOR = "[data-private]";

/**
 * Privacy-first PostHog options: route-only pageviews, the explicit free-text-free events,
 * click autocapture on buttons and links, and session replay with inputs masked and private
 * areas blocked. Heatmaps, rage/dead
 * clicks, surveys, console logs in replays and person profiles stay off in code, whatever
 * the PostHog project settings say.
 */
export function posthogOptions(apiHost: string, mode: string): Partial<PostHogConfig> {
  return {
    api_host: apiHost,
    defaults: "2026-08-30",
    // HashRouter keeps location.pathname at "/" and search text lives in the hash
    // (#/oferty?query=...). The SDK strips URL hashes, and PosthogPageviews sends one
    // $pageview per route with the route path only, never the query string.
    capture_pageview: false,
    autocapture: {
      // Clicks on buttons and links only: no form changes or submits, no field values.
      dom_event_allowlist: ["click"],
      element_allowlist: ["a", "button"],
      css_selector_ignorelist: [".ph-no-autocapture", "[data-ph-no-autocapture]", PRIVATE_SELECTOR],
      // Hash links can carry search text (#/oferty?query=...).
      element_attribute_ignorelist: ["href"],
      capture_copied_text: false,
    },
    rageclick: false,
    capture_dead_clicks: false,
    capture_heatmaps: false,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      // Blocked, not just masked: masking hides text but keeps attributes such as
      // aria-label="Usuń filtr: <search>" or the CV file name in href.
      blockSelector: PRIVATE_SELECTOR,
    },
    enable_recording_console_log: false,
    disable_surveys: true,
    // Personas are a role simulation, not users: events stay anonymous, no person profiles.
    person_profiles: "never",
    logs: { serviceName: "doroboty-ai-web", environment: mode },
  };
}

/** Starts PostHog when configured. A missing key never blocks the app (participants run without one). */
export function initPosthog() {
  if (token && host) posthog.init(token, posthogOptions(host, import.meta.env.MODE));
}
