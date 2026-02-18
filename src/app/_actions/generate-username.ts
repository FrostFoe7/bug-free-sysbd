"use server";

import { db } from "@/server/db";

export async function generateUsername(user: { email?: string | null } | null) {
  const email = user?.email;

  if (!email) {
    throw new Error("Email not available");
  }

  const usernameMatch = email.match(/^(.+)@/);

  if (!usernameMatch) {
    throw new Error("Invalid email format");
  }

  const originalUsername = usernameMatch[1];
  const cleanUsername = originalUsername?.replace(/[\+.]/g, "");

  let username = cleanUsername;

  // Check if the username is available in the database
  let isUsernameTaken = await db.user.findUnique({
    where: { username },
  });

  if (!isUsernameTaken) {
    return username;
  }

  // If not available, add an underscore and recheck
  username += "_";
  isUsernameTaken = await db.user.findUnique({
    where: { username },
  });

  if (!isUsernameTaken) {
    return username;
  }

  // If still not available, add "01" or increment a number
  let index = 1;
  while (isUsernameTaken) {
    index += 1;
    username = `${cleanUsername}${index.toString().padStart(2, "0")}`;
    isUsernameTaken = await db.user.findUnique({
      where: { username },
    });
  }

  return username;
}
