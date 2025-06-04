import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthConfig } from 'next-auth';
import { encode, JWTOptions } from 'next-auth/jwt';
import { v4 as uuid } from 'uuid';

export const jwtCallback = {
  jwt({ token, user, account }) {
    if (user) {
      token.role = user.role;
    }
    if (account?.provider === 'credentials') {
      token.credentials = true;
    }
    return token;
  },
} satisfies NextAuthConfig['callbacks'];

export const jwtOptions = (adapter: ReturnType<typeof PrismaAdapter>) => {
  return {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error('No user ID found in token');
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error('Failed to create session');
        }

        return sessionToken;
      }

      return encode(params);
    },
  } satisfies Partial<JWTOptions>;
};
