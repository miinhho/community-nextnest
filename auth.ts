import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import {
  createUser,
  findUserByEmail,
  updateUserById,
} from "./lib/actions/user";
import {
  UserNotFound,
  UserPasswordInvalid,
} from "./lib/error/auth-error-types";
import { comparePassword } from "./lib/helper/hash-helper";
import { userLoginDto } from "./lib/validation/user";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: {
        type: "email",
        label: "Email",
      },
      password: {
        type: "password",
        label: "Password",
      },
    },
    authorize: async (credentials) => {
      try {
        const { email, password } = await userLoginDto.parseAsync(credentials);

        const user = await findUserByEmail(email);
        if (user === null) {
          throw new UserNotFound();
        }

        const isPasswordValid = await comparePassword(password, user.password!);
        if (!isPasswordValid) {
          throw new UserPasswordInvalid();
        }

        return user;
      } catch {
        // auth 과정에서 발생하는 에러를 반환할 때,
        // 클라이언트 단에서 검증을 성공한 데이터만 들어오도록 설계되었기 때문에
        // ZodError 를 구분하지 않고 다른 오류와 동일하게 취급해 Auth.js 자체적으로
        // 로그인을 거부하고 다른 페이지로 이동하도록 하였음
        return null;
      }
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return {
        id: providerData.id,
        name: providerData.name,
      };
    } else {
      return {
        id: provider.id,
        name: provider.name,
      };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        try {
          const existingUser = await findUserByEmail(user.email!);
          if (!existingUser) {
            await createUser({
              email: user.email!,
              name: user.name || "",
              image: user.image || "",
              provider: "oauth",
            });
          } else {
            await updateUserById(existingUser.id, {
              name: user.name || existingUser.name!,
              image: user.image || existingUser.image || "",
              provider: "oauth",
            });
          }
        } catch (error) {
          // TODO : Logger 로 변경
          console.error("OAuth 사용자 저장 오류", error);
          return false;
        }
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.email = user.email!;
        token.name = user.name!;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
});
