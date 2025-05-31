import { signIn } from "@/lib/auth";
import { providerMap, signUp } from "@/lib/helper/auth.helper";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

const SIGNUP_ERROR_URL = "/error";

export default async function LoginPage() {
  const handleCredentials = async (formData: FormData) => {
    'use server';

    try {
      await signUp(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        // TODO : Modal 로 유저에게 처리하기
        console.log(error.message);
      }
    }
  }

  const handleProviders = async (provider: typeof providerMap[0]) => {
    'use server';

    try {
      await signIn(provider.id);
    } catch (error) {
      if (error instanceof AuthError) {
        return redirect(`${SIGNUP_ERROR_URL}?error=${error.type}`)
      }
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form action={handleCredentials}>
        <label htmlFor="email">
          Email
          <input name="email" id="email" />
        </label>
        <label htmlFor="password">
          Password
          <input name="password" id="password" />
        </label>
        <input type="submit" value="회원가입" />
      </form>
      {Object.values(providerMap).map((provider) => (
        <form
          action={() => handleProviders(provider)}
          key={provider.id}
        >
          <button type="submit">
            <span>{provider.name} 으로 로그인</span>
          </button>
        </form>
      ))}
    </div>
  );
}