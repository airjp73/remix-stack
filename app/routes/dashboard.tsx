import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import { requireAuthentication } from "~/session.server";
import { ThemeToggle } from "~/theme";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuthentication(request);
  return json({
    email: user.idToken.email,
    picture: user.idToken.picture,
  });
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { email, picture } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex min-h-full flex-col justify-center bg-gray-50 py-12 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight dark:text-slate-100 lg:text-5xl">
            {t("dashboard.title")}
          </h1>
          <p>{t("dashboard.welcome", { name: email })}</p>
          {picture && <img src={picture} alt="You" />}
        </div>
      </div>
    </>
  );
}
