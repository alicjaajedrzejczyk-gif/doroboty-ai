import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import { App } from "./features/prototype/app";
import { initPosthog } from "./lib/posthog";
import "./app/globals.css";

initPosthog();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <App />
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
);
