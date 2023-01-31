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
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "./i18n.server";
import { env } from "./env/env.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";

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
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export const handle = { i18n: "common" };

export async function loader({ request }: LoaderArgs) {
  const locale = await i18next.getLocale(request);
  return json({
    locale,
    env: {
      NODE_ENV: env.NODE_ENV,
    },
  });
}

export default function App() {
  const { locale, env } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

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
      <body className="h-full bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
