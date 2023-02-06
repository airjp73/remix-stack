import { useLocation, useMatches } from "@remix-run/react";
import { useEffect } from "react";
import * as Sentry from "@sentry/remix";
import { clientEnv } from "~/env/env.client";

export const initClientSentry = () => {
  if (!clientEnv.SENTRY_DSN) return;

  Sentry.init({
    dsn: clientEnv.SENTRY_DSN,
    tunnel: "/sentry",
    tracesSampleRate: 1,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.remixRouterInstrumentation(
          useEffect,
          useLocation,
          useMatches
        ),
      }),
    ],
  });
};
