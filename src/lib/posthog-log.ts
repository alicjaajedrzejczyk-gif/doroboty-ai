import posthog from "posthog-js";

type LogAttributes = Record<string, boolean | number | string>;

const posthogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
);

export const appLog = {
  info(message: string, attributes: LogAttributes) {
    if (posthogConfigured) posthog.logger.info(message, attributes);
  },
};
