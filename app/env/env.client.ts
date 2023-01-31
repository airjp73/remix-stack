import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().optional(),
});

export const clientEnv = schema.parse((window as any).env);
