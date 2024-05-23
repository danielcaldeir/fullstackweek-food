import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { db } from "@/lib/prisma";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { Adapter } from "next-auth/adapters";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db) as Adapter,
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        session.user = { ...session.user, id: user.id };
        return session;
      },
    },
    secret: process.env.NEXT_AUTH_SECRET,
};