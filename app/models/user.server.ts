import type { User } from "@prisma/client";
import { db } from "~/db.server";

export async function get_user_by_id(id: User["id"]) {
  return db.user.findUnique({ where: { id } });
}

export async function get_or_create_user(
  userParams: Pick<User, "email" | "firebase_uid">
) {
  const user = await db.user.findUnique({
    where: { firebase_uid: userParams.firebase_uid },
  });
  if (user) return user;

  return db.user.create({ data: userParams });
}

export async function get_user_by_uid(firebase_uid: User["firebase_uid"]) {
  return db.user.findUnique({ where: { firebase_uid } });
}
