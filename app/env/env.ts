import { clientEnv } from "./env.client";
import { env } from "./env.server";

export const isomorphicEnv = typeof window === "undefined" ? env : clientEnv;
