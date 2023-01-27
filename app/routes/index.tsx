import { useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ValidatedForm, validationError } from "remix-validated-form";
// import { Alert } from "~/design-system/Alert";
import { zfd } from "zod-form-data";
import { Field, FieldInput } from "~/ui/form/Field";
import { SubmitButton } from "~/ui/form/SubmitButton";

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
  return (
    <>
      <div className="flex min-h-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mt-8">
              {/* {data && "message" in data && (
                <Alert variant="info" details={data.message} />
              )} */}
              <div className="mt-6">
                <ValidatedForm
                  validator={validator}
                  action="?index"
                  method="post"
                  className="space-y-6"
                >
                  <Field
                    name="name"
                    label="Name"
                    description="Should say your name"
                  >
                    <FieldInput />
                  </Field>
                  <Field name="email" label="Email">
                    <FieldInput />
                  </Field>
                  <SubmitButton
                    variant="default"
                    label="Submit"
                    loadingLabel="Submitting..."
                    className="w-full"
                  />
                </ValidatedForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
