import { useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Card,
  Center,
} from "@chakra-ui/react";
import { Input } from "~/form/Input";
import { SubmitButton } from "~/form/SubmitButton";

const validator = withZod(
  z.object({
    name: zfd.text(),
    email: zfd.text(z.string().email()),
  })
);

export const action = async ({ request }: ActionArgs) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);

  return json({
    message: `Hello ${data.data.name}! Your email is: ${data.data.email}`,
  });
};

export default function Example() {
  const data = useActionData<typeof action>();
  return (
    <>
      <Center height="full" bg="gray.50">
        <Card py={8} px={4} w="sm">
          {data && "message" in data && (
            <Alert status="success">
              <AlertIcon />
              <AlertDescription>{data.message}</AlertDescription>
            </Alert>
          )}
          <ValidatedForm
            validator={validator}
            action="?index"
            method="post"
            className="space-y-6"
          >
            <Input label="Name" name="name" />
            <Input label="Email" name="email" />
            <SubmitButton colorScheme="pink">Submit</SubmitButton>
          </ValidatedForm>
        </Card>
      </Center>
    </>
  );
}
