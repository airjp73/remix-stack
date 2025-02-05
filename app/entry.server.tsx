import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createInstance } from "i18next";
import i18next from "./i18n.server";
import { initReactI18next } from "react-i18next";
import I18NexFsBackend from "i18next-fs-backend";
import i18n from "./i18n";
import en_common from "~/../public/locales/en/common.json";
import { initServerSentry } from "./sentry/sentry.server";

const ABORT_DELAY = 5000;

if (process.env.MOCKED) {
  require("./mocks.server");
}

initServerSentry();

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  const instance = createInstance();
  const lng = await i18next.getLocale(request);
  const ns = i18next.getRouteNamespaces(remixContext);

  await instance
    .use(initReactI18next)
    .use(I18NexFsBackend)
    .init({
      ...i18n,
      lng,
      ns,
      resources: {
        en: {
          common: en_common,
        },
      },
    });

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      // <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} />,
      // </I18nextProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError: (err: unknown) => {
          reject(err);
        },
        onError: (error: unknown) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
