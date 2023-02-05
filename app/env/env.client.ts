import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().optional(),
  SENTRY_DSN: z.string(),
});

export const clientEnv = schema.parse((window as any).env);
