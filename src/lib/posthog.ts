import posthog, { type PostHogConfig } from "posthog-js";

const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

/** Analytics run only when both variables are set (Netlify production or a local .env). */
export const posthogConfigured = Boolean(token && host);

/**
 * Privacy-first PostHog options. Project settings in PostHog enable session replay,
 * autocapture and heatmaps, so the SDK switches them off explicitly here; only the
 * explicit, free-text-free events in the features and pageviews are sent.
 */
export function posthogOptions(apiHost: string, mode: string): Partial<PostHogConfig> {
  return {
    api_host: apiHost,
    defaults: "2026-08-30",
    // HashRouter keeps location.pathname at "/" and search text lives in the hash
    // (#/oferty?query=...). The SDK strips URL hashes, and PosthogPageviews sends one
    // $pageview per route with the route path only, never the query string.
    capture_pageview: false,
    autocapture: false,
    rageclick: false,
    capture_dead_clicks: false,
    capture_heatmaps: false,
    disable_session_recording: true,
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
