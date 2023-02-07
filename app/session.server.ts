import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";
import { serverAuth } from "./firebase/firebase.server";
import { env } from "./env/env.server";
import { User } from "@prisma/client";
import { get_user_by_uid } from "./models/user.server";

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

export const commitSession = sessionStorage.commitSession;

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// 7 days
export const SESSION_EXPIRY_MILLIS = 60 * 60 * 24 * 7 * 1000;
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
        expires: remember
          ? new Date(Date.now() + SESSION_EXPIRY_MILLIS)
          : undefined,
      }),
    },
  });
}

export async function getUser(request: Request): Promise<User | null> {
  const session = await getSession(request);
  return getUserFromSession(session);
}

export async function getUserFromSession(session: Session) {
  const idToken = session.get(ID_TOKEN_KEY);
  if (!idToken) return null;

  try {
    const decoded = await serverAuth.verifyIdToken(idToken);
    const user = await get_user_by_uid(decoded.uid);
    return user;
  } catch (err) {
    return null;
  }
}

export async function getFirebaseToken(uid: string) {
  const firebaseJwt = await serverAuth.createCustomToken(uid);
  return firebaseJwt;
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
