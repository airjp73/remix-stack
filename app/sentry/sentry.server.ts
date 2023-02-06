import * as Sentry from "@sentry/remix";
import { db } from "~/db.server";
import { env } from "~/env/env.server";

export const initServerSentry = () => {
  if (!env.SENTRY_DSN) return;

  Sentry.init({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 1,
    integrations: [new Sentry.Integrations.Prisma({ client: db })],
  });
};
