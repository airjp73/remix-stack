import { useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { Field, FieldInput } from "~/ui/form/Field";
import { SubmitButton } from "~/ui/form/SubmitButton";
import { Alert } from "~/ui/Alert";
import { ThemeToggle } from "~/theme";
import { useTranslation } from "react-i18next";

const validator = withZod(
  z.object({
    name: zfd.text(),
    email: zfd.text(z.string().email()),
  })
);

export const action = async ({ request }: ActionArgs) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return json({
    message: `Hello ${data.data.name}! Your email is: ${data.data.email}`,
  });
};

export default function Example() {
  const data = useActionData<typeof action>();
  const { t } = useTranslation();
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex min-h-full flex-col justify-center bg-gray-50 py-12 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mt-8">
            {data && "message" in data && (
              <Alert variant="info" details={data.message} />
            )}
            <div className="mt-6">
              <ValidatedForm
                validator={validator}
                action="?index"
                method="post"
                className="space-y-6"
              >
                <Field
                  name="name"
                  label={t("name")}
                  description="Should say your name"
                >
                  <FieldInput />
                </Field>
                <Field name="email" label={t("email")}>
                  <FieldInput />
                </Field>
                <SubmitButton
                  variant="default"
                  label={t("submit")}
                  loadingLabel={t("submitting")!}
                  className="w-full"
                />
              </ValidatedForm>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
