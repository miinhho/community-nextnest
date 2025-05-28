import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { encode } from "next-auth/jwt";
import { Provider } from "next-auth/providers";
import { v4 as uuid } from "uuid";
import { credentialsProvider } from "./lib/helper/auth-helper";
import prisma from "./lib/prisma";

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
    jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }

      return encode(params);
    },
  },
});
