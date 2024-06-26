import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
// import GoogleProvider from "next-auth/providers/google";
// import GithubProvider from "next-auth/providers/github";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "@/lib/prisma";
// import { Adapter } from "next-auth/adapters";

// const handler = NextAuth({
//   adapter: PrismaAdapter(db) as Adapter,
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   callbacks: {
//     async session({ session, user }) {
//       session.user = { ...session.user, id: user.id };
//       return session;
//     },
//   },
// });

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };