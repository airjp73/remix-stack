import { LoaderArgs } from "@remix-run/server-runtime";
import { env } from "~/env/env.server";
import { serverStorage } from "~/firebase/firebase.server";
import { requireAuthentication } from "~/session.server";

const MAX_AGE = 60 * 60 * 24; // 1 day

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuthentication(request);
  const res = serverStorage
    .bucket(env.FIREBASE_CLOUD_STORAGE_BUCKET)
    .file(`profile-pictures/${user.firebase_uid}/profile`)
    .createReadStream();

  // The firebase Readable doesn't satisfy the NodeJS ReadableStream
  // but this works
  return new Response(res as any as ReadableStream, {
    headers: {
      "Cache-Control": `max-age=${MAX_AGE}`,
    },
  });
};
