// Use this to create a new user and login with that user
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts username@example.com
// and it will log out the cookie value you can use to interact with the server
// as that new user.

import { installGlobals } from "@remix-run/node";
import { parse } from "cookie";
import { z } from "zod";
import { createUserSession } from "~/session.server";
import { config } from "dotenv";
import { serverAuth } from "~/firebase/firebase.server";
import { db } from "~/db.server";
config();

installGlobals();

async function createAndLogin(email: string) {
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  const res = await fetch(
    `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: "myreallystrongpassword",
        returnSecureToken: true,
      }),
    }
  );
  const schema = z.object({ idToken: z.string() });
  const data = schema.parse(await res.json());
  const { uid } = await serverAuth.verifyIdToken(data.idToken);

  await db.user.create({ data: { email, firebase_uid: uid } });

  const response = await createUserSession({
    request: new Request("test://test"),
    idToken: data.idToken,
    remember: false,
    redirectTo: "/",
  });

  const cookieValue = response.headers.get("Set-Cookie");
  if (!cookieValue) {
    throw new Error("Cookie missing from createUserSession response");
  }
  const parsedCookie = parse(cookieValue);
  // we log it like this so our cypress command can parse it out and set it as
  // the cookie value.
  console.log(
    `
<idToken>
  ${data.idToken}
</idToken>
<cookie>
  ${parsedCookie.__session}
</cookie>
  `.trim()
  );
}

createAndLogin(process.argv[2]);
