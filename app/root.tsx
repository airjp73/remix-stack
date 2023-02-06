import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "./i18n.server";
import { env } from "./env/env.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { useHydrated } from "remix-utils";
import {
  commitSession,
  getFirebaseToken,
  getSession,
  getUserFromSession,
} from "./session.server";
import { FirebaseClientOptions } from "./firebase/firebase.client";
import { getNotification, Notification } from "./notifications";
import { withSentry } from "@sentry/remix";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Inter",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Stack",
  viewport: "width=device-width,initial-scale=1",
});

export const handle = { i18n: "common" };

export async function loader({ request }: LoaderArgs) {
  const locale = await i18next.getLocale(request);
  const session = await getSession(request);
  const user = await getUserFromSession(session);
  const firebaseJwt = user
    ? await getFirebaseToken(user.firebase_uid)
    : undefined;
  const notification = await getNotification(session);
  return json(
    {
      locale,
      env: {
        NODE_ENV: env.NODE_ENV,
        SENTRY_DSN: env.SENTRY_DSN,
      },
      user,
      firebaseJwt,
      firebaseOptions: {
        apiKey: env.FIREBASE_API_KEY,
        authDomain: env.FIREBASE_AUTH_DOMAIN,
        projectId: env.FIREBASE_PROJECT_ID,
        appId: env.FIREBASE_APP_ID,
        emulatorUrl: env.FIREBASE_AUTH_EMULATOR_HOST,
        storageBucket: env.FIREBASE_CLOUD_STORAGE_BUCKET,
      } satisfies FirebaseClientOptions,
      notification,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type RootLoaderData = SerializeFrom<typeof loader>;

function App() {
  const { locale, env } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  const isHydrated = useHydrated();

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useIsomorphicLayoutEffect(() => {
    // We do this here as well as the script tag below.
    // The script tag ensures the theme is set before hydration.
    // This effect ensures the theme is set when refreshing the page in dev mode
    if (localStorage.theme === "dark")
      document.documentElement.dataset.theme = "dark";
  }, []);

  return (
    <html lang={locale} dir={i18n.dir()} className="h-full">
      <head>
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ensure dark mode is always correctly set without a flash of light mode 
              if (localStorage.theme) {
                document.documentElement.dataset.theme = localStorage.theme;
              } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.dataset.theme = 'dark';
              } else {
                document.documentElement.dataset.theme = 'light';
              }

              // Provide global env variables to the window
              window.env = ${JSON.stringify(env)};
            `,
          }}
        />
      </head>
      <body
        className="h-full bg-gray-50 font-sans text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-50"
        data-hydrated={isHydrated}
      >
        <Notification className="absolute bottom-8 left-1/2 w-3/4 -translate-x-1/2 sm:bottom-auto sm:top-8 sm:w-96" />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default withSentry(App);
