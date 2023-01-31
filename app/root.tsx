import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
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
import { getFirebaseToken, getUser } from "./session.server";
import { signInWithCustomToken } from "firebase/auth";
import {
  FirebaseClientOptions,
  getClientAuth,
} from "./firebase/firebase.client";

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
  const user = await getUser(request);
  const firebaseJwt = user
    ? await getFirebaseToken(user.firebase_uid)
    : undefined;
  return json({
    locale,
    env: {
      NODE_ENV: env.NODE_ENV,
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
  });
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function App() {
  const { locale, env, firebaseJwt, firebaseOptions } =
    useLoaderData<typeof loader>();
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

  // TODO: move this elsewhere so the whole site doesn't rely on firebase
  useEffect(() => {
    if (firebaseJwt) {
      const auth = getClientAuth(firebaseOptions);
      signInWithCustomToken(auth, firebaseJwt).catch((err) => {
        // TODO: do something here?
        console.log(err);
      });
    }
  }, [firebaseJwt, firebaseOptions]);

  return (
    <html lang={locale} dir={i18n.dir()} className="h-full">
      <head>
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ensure dark mode is always correctly set without a flash of light mode 
              if (localStorage.theme === 'dark') document.documentElement.dataset.theme = 'dark';

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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
