import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initializeUserBoard } from "../init-user-board";
import connectDB from "../db";

// FOR DEVELOPMENT
// const client = new MongoClient(process.env.MONGODB_URI!);
// const db = client.db();

// always use one connection
// FOR PRODUCTION
const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient(); //now we are using the same client
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.id) {
            await initializeUserBoard(user.id);
          }
        },
      },
    },
  },
});

// We will use this to get if there is a current user signed in or not. That s to know if a user is logged in or not
export async function getSession() {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  return result;
}

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  if (result.success) {
    redirect("/sign-in");
  }
}
