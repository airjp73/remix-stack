import { DataFunctionArgs } from "@remix-run/server-runtime";

const sentryHost = "sentry.io";

const handler = async ({ request }: DataFunctionArgs) => {
  const envelope = await request.text();
  const pieces = envelope.split("\n");
  const header = JSON.parse(pieces[0]);
  const { pathname } = new URL(header.dsn);

  // remove leading slash
  const projectId = pathname.substring(1);

  const ingestUrl = `https://${sentryHost}/api/${projectId}/envelope/`;
  return await fetch(ingestUrl, { method: "POST", body: envelope });
};

export const action = handler;
export const loader = handler;
