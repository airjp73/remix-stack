import { redirect, Session } from "@remix-run/server-runtime";
import { ComponentProps } from "react";
import type { RootLoaderData } from "./root";
import { getSession, sessionStorage } from "./session.server";
import { AlertVariants, DismissibleAlert } from "./ui/Alert";
import { useMatchesData } from "./utils";

export const redirectWithNotification = async ({
  request,
  redirectTo,
  notification,
  notificationType,
}: {
  request: Request;
  redirectTo: string;
  notification: string;
  notificationType: AlertVariants;
}) => {
  const session = await getSession(request);
  session.flash("notification", notification);
  session.flash("notificationType", notificationType);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export const getNotification = async (session: Session) => {
  const notification = session.get("notification");
  const type = session.get("notificationType");

  if (!notification) return null;
  return { notification, type };
};

export const Notification = (
  props: Omit<
    ComponentProps<typeof DismissibleAlert>,
    "variant" | "details" | "title"
  >
) => {
  const { notification } = useMatchesData<RootLoaderData>("root");
  if (!notification) return null;
  return (
    <DismissibleAlert
      variant={notification.type}
      details={notification.notification}
      {...props}
    />
  );
};
