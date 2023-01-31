// Use this to delete a user by their email
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts username@example.com
// and that user will get deleted

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { installGlobals } from "@remix-run/node";

import { db } from "~/db.server";

installGlobals();

async function deleteUser(email: string, idToken: string) {
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  async function cleanupPrisma() {
    try {
      await db.user.delete({ where: { email } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        console.log("User not found, so no need to delete");
      } else {
        throw error;
      }
    } finally {
      await db.$disconnect();
    }
  }

  async function cleanupFirebase() {
    const res = await fetch(
      `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to delete user. ${await res.text()}`);
    }
  }

  await Promise.all([cleanupPrisma(), cleanupFirebase()]);
}

deleteUser(process.argv[2], process.argv[3]);
