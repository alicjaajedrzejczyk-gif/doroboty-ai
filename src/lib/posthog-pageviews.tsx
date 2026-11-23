import { useEffect } from "react";
import { useLocation } from "react-router";
import posthog from "posthog-js";
import { posthogConfigured } from "./posthog";

/** Route path only: the hash query (search text, filters) is deliberately left out. */
export function pageviewProperties(origin: string, pathname: string) {
  return { $current_url: `${origin}/#${pathname}`, $pathname: pathname };
}

let lastPathname: string | undefined;

/** Sends one $pageview per hash route; render inside HashRouter. */
export function PosthogPageviews() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!posthogConfigured || pathname === lastPathname) return;
    lastPathname = pathname;
    posthog.capture("$pageview", pageviewProperties(window.location.origin, pathname));
  }, [pathname]);
  return null;
}
