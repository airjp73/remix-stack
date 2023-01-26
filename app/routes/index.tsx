import { useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Alert } from "~/design-system/Alert";
import { Button } from "~/design-system/Button";
import { Input } from "~/design-system/controls/Input";

export const action = ({ request }: ActionArgs) => {
  return json({ message: "Hello world!" }, { status: 200 });
};

export default function Example() {
  const data = useActionData<typeof action>();
  return (
    <>
      <div className="flex min-h-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mt-8">
              {data && <Alert variant="info" details={data.message} />}
              <div className="mt-6">
                <form action="?index" method="POST" className="space-y-6">
                  <Input label="Name" name="name" type="text" />
                  <Input label="Email" name="email" type="text" />
                  <Button label="Submit" className="w-full" type="submit" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
