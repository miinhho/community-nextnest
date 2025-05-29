import { signIn } from "@/auth";
import { UserNotFound, UserPasswordInvalid } from "@/lib/error/auth-error-types";
import { providerMap } from "@/lib/helper/auth.helper";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

interface Props {
  searchParams: {
    callbackUrl?: string
  }
}

const SIGNIN_ERROR_URL = "/error";

export default async function LoginPage({
  searchParams
}: Props) {
  const handleCredentials = async (formData: FormData) => {
    'use server';

    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof ZodError) {
        // TODO : Modal 로 유저에게 처리하기
        console.log(error.message);
      }
      if (error instanceof UserNotFound) {
        // TODO : 이메일로 유저를 찾을 수 없을 때 처리
      }
      if (error instanceof UserPasswordInvalid) {
        // TODO : 비밀번호가 같지 않을 때 처리
      }
      throw error;
    }
  };

  const handleProviders = async (provider: typeof providerMap[0]) => {
    'use server';

    try {
      await signIn(provider.id, {
        redirectTo: searchParams?.callbackUrl ?? "",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
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
        <input type="submit" value="로그인" />
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