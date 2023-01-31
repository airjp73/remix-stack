import { Outlet, useLoaderData, useMatches } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { FirebaseClientOptions } from "~/firebase/firebase.client";
import { env } from "~/env/env.server";
import { ThemeToggle } from "~/theme";

export const loader = async () => {
  return json({
    firebaseOptions: {
      apiKey: env.FIREBASE_API_KEY,
      authDomain: env.FIREBASE_AUTH_DOMAIN,
      projectId: env.FIREBASE_PROJECT_ID,
      appId: env.FIREBASE_APP_ID,
      emulatorUrl: env.FIREBASE_AUTH_EMULATOR_HOST,
    } satisfies FirebaseClientOptions,
  });
};

export const AuthHeader = ({ children }: PropsWithChildren) => (
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
      {children}
    </h2>
  </div>
);

export default function AuthLayout() {
  const matches = useMatches();
  const headerMatch = matches.find(
    (match) => typeof match.handle?.authHeader === "function"
  );
  const { t } = useTranslation();
  const data = useLoaderData<typeof loader>();

  return (
    <div className="h-full">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        {headerMatch && (
          <AuthHeader>{headerMatch.handle!.authHeader(t)}</AuthHeader>
        )}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="space-y-6 bg-white py-8 px-4 shadow-lg dark:bg-gray-800 sm:rounded-lg sm:px-10">
            <Outlet context={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
