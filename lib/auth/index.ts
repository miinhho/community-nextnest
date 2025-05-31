import { credentialsProvider } from "@/lib/auth/credential-provider";
import { jwtCallback, jwtOptions } from "@/lib/auth/jwt";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";

export const providers: Provider[] = [credentialsProvider];
const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers,
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
  },
  callbacks: {
    ...jwtCallback,
  },
  jwt: {
    ...jwtOptions(adapter),
  },
});
