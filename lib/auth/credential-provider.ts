import { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import { findUserWithPasswordByEmail } from "../actions/user.actions";
import { UserNotFound, UserPasswordInvalid } from "../error/auth-error-types";
import { comparePassword } from "../helper/hash.helper";
import { userLoginDto } from "../validation/user.validate";

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

      const user = await findUserWithPasswordByEmail(email);
      if (user === null) {
        throw new UserNotFound();
      }

      const isPasswordValid = await comparePassword(password, user.password!);
      if (!isPasswordValid) {
        throw new UserPasswordInvalid();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeUser } = user;

      return safeUser;
    } catch {
      return null;
    }
  },
});
