import { describe, expect, it } from "vitest";
import { pageviewProperties } from "./posthog-pageviews";
import { PRIVATE_SELECTOR, posthogOptions } from "./posthog";

describe("posthogOptions", () => {
  const options = posthogOptions("https://eu.i.posthog.com", "production");

  it("keeps session replay, heatmaps, rage/dead clicks, surveys and person profiles off", () => {
    expect(options).toMatchObject({
      disable_session_recording: true,
      rageclick: false,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      disable_surveys: true,
      person_profiles: "never",
    });
  });

  it("autocaptures only clicks on buttons and links outside private areas, without hrefs", () => {
    expect(options.autocapture).toMatchObject({
      dom_event_allowlist: ["click"],
      element_allowlist: ["a", "button"],
      element_attribute_ignorelist: ["href"],
      capture_copied_text: false,
    });
    const autocapture = options.autocapture as { css_selector_ignorelist: string[] };
    expect(autocapture.css_selector_ignorelist).toContain(PRIVATE_SELECTOR);
    expect(autocapture.css_selector_ignorelist).toContain(".ph-no-autocapture");
  });

  it("leaves pageviews to the router so search text in the hash is never sent", () => {
    expect(options.capture_pageview).toBe(false);
    expect(options).not.toHaveProperty("disable_capture_url_hashes", false);
  });
});

describe("pageviewProperties", () => {
  it("keeps the hash route path and drops the query string", () => {
    expect(pageviewProperties("https://doroboty.example", "/oferty")).toEqual({
      $current_url: "https://doroboty.example/#/oferty",
      $pathname: "/oferty",
    });
  });
});
