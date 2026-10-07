import * as Sentry from "@sentry/react";

const getFinalContext = (context = {}) => {
  return {
    environment:
      process.env.REACT_APP_ENVIRONMENT || "development",

    pluginVersion:
      process.env.REACT_APP_PLUGIN_VERSION || "unknown",
    ...context,
  };
};

const logger = {
  error(error, context = {}) {
    const finalContext = getFinalContext(context);

    Sentry.withScope((scope) => {
      Object.entries(finalContext).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          scope.setTag(key, String(value));
        }
      });

      Sentry.captureException(error);
    });
  },

  warning(message, context = {}) {
    const finalContext = getFinalContext(context);

    Sentry.withScope((scope) => {
      Object.entries(finalContext).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          scope.setTag(key, String(value));
        }
      });

      Sentry.captureMessage(message, "warning");
    });
  },
};

export default logger;