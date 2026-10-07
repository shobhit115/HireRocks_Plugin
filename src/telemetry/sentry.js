import * as Sentry from "@sentry/react";

const sentryDSN = process.env.REACT_APP_SENTRY_DSN;

export const initSentry = () => {
  Sentry.init({
    dsn: sentryDSN,
    environment: process.env.REACT_APP_ENVIRONMENT || "development",

    sendDefaultPii: false,
  });
};
