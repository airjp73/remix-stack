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
    ignoreErrors: [
      "https://reactjs.org/docs/error-decoder.html?invariant=418", // Hydration failed because the initial UI does not match what was rendered on the server.
      "https://reactjs.org/docs/error-decoder.html?invariant=422", // There was an error while hydrating this Suspense boundary. Switched to client rendering.
      "https://reactjs.org/docs/error-decoder.html?invariant=423", // There was an error while hydrating.
      "https://reactjs.org/docs/error-decoder.html?invariant=425", // Text content does not match server-rendered HTML...
    ],
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

export const reportError = (error: Error) => {
  if (!clientEnv.SENTRY_DSN) {
    console.error(error);
    return;
  }

  Sentry.captureException(error);
};
