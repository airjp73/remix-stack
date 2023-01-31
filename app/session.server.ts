import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { DecodedIdToken } from "firebase-admin/auth";
import { serverAuth } from "./firebase/firebase.server";
import { env } from "./env/env.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// 7 days
export const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 7;
const ID_TOKEN_KEY = "idToken";

export async function createUserSession({
  request,
  idToken,
  remember,
  redirectTo,
}: {
  request: Request;
  idToken: string;
  redirectTo: string;
  remember?: boolean;
}) {
  const session = await getSession(request);
  session.set(ID_TOKEN_KEY, idToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? SESSION_EXPIRY_SECONDS : undefined,
      }),
    },
  });
}

type User = {
  idToken: DecodedIdToken;
};

export async function requireAuthentication(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<User> {
  const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
  const redirectUrl = `/login?${searchParams}`;

  const session = await getSession(request);
  const idToken = session.get(ID_TOKEN_KEY);

  if (!idToken) {
    throw redirect(redirectUrl);
  }

  try {
    const decoded = await serverAuth.verifyIdToken(idToken);
    return { idToken: decoded };
  } catch (err) {
    throw redirect(redirectUrl);
  }
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
