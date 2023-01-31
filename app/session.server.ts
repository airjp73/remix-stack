import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { serverAuth } from "./firebase/firebase.server";
import { env } from "./env/env.server";
import { User } from "@prisma/client";
import { get_user_by_uid } from "./models/user.server";
import invariant from "tiny-invariant";

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
  const firebaseJwt = await serverAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRY_SECONDS,
  });
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        expires: new Date(Date.now() + SESSION_EXPIRY_SECONDS * 1000),
      }),
    },
  });
}

export async function getUser(request: Request): Promise<User | null> {
  const session = await getSession(request);
  const idToken = session.get(ID_TOKEN_KEY);
  if (!idToken) return null;

  const decoded = await serverAuth.verifyIdToken(idToken);
  const user = await get_user_by_uid(decoded.uid);
  invariant(user, "user not found");

  return user;
}

export async function requireAuthentication(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<User> {
  const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
  const redirectUrl = `/login?${searchParams}`;

  try {
    const user = await getUser(request);
    if (!user) throw redirect(redirectUrl);
    return user;
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
