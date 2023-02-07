import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import { ValidatedForm } from "remix-validated-form";
import { requireAuthentication } from "~/session.server";
import { ThemeToggle } from "~/theme";
import { SubmitButton } from "~/ui/form/SubmitButton";
import { Link } from "~/ui/Link";
import { makeValidator } from "~/validation";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuthentication(request);
  return json({ email: user.email, profile_photo: user.profile_photo });
};

const validator = makeValidator({});

export default function Dashboard() {
  const { t } = useTranslation();
  const { email, profile_photo } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="absolute top-4 left-4">
        <ValidatedForm validator={validator} method="post" action="/logout">
          <SubmitButton label="Logout" loadingLabel="Logging out..." />
        </ValidatedForm>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex min-h-full flex-col justify-center bg-gray-50 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight dark:text-gray-100 lg:text-5xl">
            {t("dashboard.title")}
          </h1>
          <p>{t("dashboard.welcome", { name: email })}</p>
          <div className="mt-4 flex items-center space-x-4">
            {profile_photo && (
              <img
                className="h-20 w-20 rounded-full"
                src={`user-images/${profile_photo}`}
                alt={t("dashboard.yourProfile")}
              />
            )}
            <Link href="/upload-profile-picture">
              {t("dashboard.uploadProfileLink")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
