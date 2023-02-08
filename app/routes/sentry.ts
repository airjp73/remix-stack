import { ActionArgs, json } from "@remix-run/server-runtime";

const sentryHost = "sentry.io";

export const action = async ({ request }: ActionArgs) => {
  const envelope = await request.text();
  const pieces = envelope.split("\n");
  const header = JSON.parse(pieces[0]);
  const { host, pathname } = new URL(header.dsn);

  // remove leading slash
  const projectId = pathname.substring(1);

  // if (host !== sentryHost) {
  //   throw new Error(`Invalid Sentry host: ${host}`);
  // }

  const ingestUrl = `https://${sentryHost}/api/${projectId}/envelope/`;
  const response = await fetch(ingestUrl, { method: "POST", body: envelope });

  return json({ status: response.status }, { status: response.status });
};
