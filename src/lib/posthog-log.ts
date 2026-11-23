import posthog from "posthog-js";
import { posthogConfigured } from "./posthog";

type LogAttributes = Record<string, boolean | number | string>;

export const appLog = {
  info(message: string, attributes: LogAttributes) {
    if (posthogConfigured) posthog.logger.info(message, attributes);
  },
};
