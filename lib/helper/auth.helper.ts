import { providers } from "@/lib/auth";
import { createUser } from "../actions/user.actions";
import { userLoginDto } from "../validation/user.validate";

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
