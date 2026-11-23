import { describe, expect, it } from "vitest";
import { pageviewProperties } from "./posthog-pageviews";
import { posthogOptions } from "./posthog";

describe("posthogOptions", () => {
  const options = posthogOptions("https://eu.i.posthog.com", "production");

  it("turns off recording, autocapture and person profiles regardless of project settings", () => {
    expect(options).toMatchObject({
      autocapture: false,
      rageclick: false,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      disable_session_recording: true,
      disable_surveys: true,
      person_profiles: "never",
    });
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
