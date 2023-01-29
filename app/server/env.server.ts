import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  FIREBASE_API_KEY: z.string(),
  FIREBASE_AUTH_DOMAIN: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_APP_ID: z.string(),
  FIREBASE_SERVICE_KEY: z.string(),
  FIREBASE_AUTH_EMULATOR_HOST: z.string().optional(),
});

export const env = schema.parse(process.env);
