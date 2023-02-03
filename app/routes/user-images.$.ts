import { json, LoaderArgs } from "@remix-run/server-runtime";
import { z } from "zod";
import { env } from "~/env/env.server";
import { serverStorage } from "~/firebase/firebase.server";
import { requireAuthentication } from "~/session.server";

const MAX_AGE = 60 * 60 * 24; // 1 day

const paramSchema = z.object({
  "*": z.string(),
});

export const loader = async ({ request, params: rawParams }: LoaderArgs) => {
  const user = await requireAuthentication(request);
  const { "*": filePath } = paramSchema.parse(rawParams);

  const imageUserId = filePath.split("/")[0];
  if (user.firebase_uid !== imageUserId) {
    throw json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = serverStorage
    .bucket(env.FIREBASE_CLOUD_STORAGE_BUCKET)
    .file(filePath)
    .createReadStream();

  // The firebase Readable doesn't satisfy the NodeJS ReadableStream
  // but this works
  return new Response(res as any as ReadableStream, {
    headers: {
      "Cache-Control": `max-age=${MAX_AGE}`,
    },
  });
};
