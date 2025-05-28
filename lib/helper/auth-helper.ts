import { providers } from "@/auth";
import { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import { createUser, findUserByEmail } from "../actions/user-actions";
import { UserNotFound, UserPasswordInvalid } from "../error/auth-error-types";
import { userLoginDto } from "../validation/user-validate";
import { comparePassword } from "./hash-helper";

export const credentialsProvider: Provider = Credentials({
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
      return null;
    }
  },
});

export const signUp = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const validatedData = userLoginDto.parse({ email, password });

  await createUser({
    email: validatedData.email,
    password: validatedData.password,
  });
};

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
