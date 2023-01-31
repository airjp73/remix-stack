import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useTranslation } from "react-i18next";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { requireAuthentication } from "~/session.server";
import { ThemeToggle } from "~/theme";
import { SubmitButton } from "~/ui/form/SubmitButton";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuthentication(request);
  return json({ email: user.email });
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { email } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="absolute top-4 left-4">
        <ValidatedForm
          validator={withZod(z.object({}))}
          method="post"
          action="/logout"
        >
          <SubmitButton label="Logout" loadingLabel="Logging out..." />
        </ValidatedForm>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex min-h-full flex-col justify-center bg-gray-50 py-12 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight dark:text-gray-100 lg:text-5xl">
            {t("dashboard.title")}
          </h1>
          <p>{t("dashboard.welcome", { name: email })}</p>
        </div>
      </div>
    </>
  );
}
