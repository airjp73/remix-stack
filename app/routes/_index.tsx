import { ThemeToggle } from "~/theme";
import { useTranslation } from "react-i18next";
import { ButtonLink } from "~/ui/Button";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <div className="absolute top-4 left-4">
        <ButtonLink href="/login">{t("login.loginButton.label")}</ButtonLink>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex min-h-full flex-col justify-center bg-gray-50 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight dark:text-gray-100 lg:text-5xl">
            {t("greeting")}
          </h1>
        </div>
      </div>
    </>
  );
}
