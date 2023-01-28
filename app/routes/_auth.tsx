import { Outlet, useMatches } from "@remix-run/react";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "~/theme";

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
          <div className="space-y-6 bg-white py-8 px-4 shadow-lg dark:bg-slate-800 sm:rounded-lg sm:px-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
