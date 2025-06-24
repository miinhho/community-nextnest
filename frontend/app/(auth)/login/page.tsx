'use client';

import { useAuthLoginQuery } from "@/lib/query/auth.query";
import { cn } from "@/lib/utils";
import { loginData } from "@/lib/validation/auth.validate";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ZodError } from "zod/v4";

export default function LoginPage() {
  const { mutate: loginMutation, isPending } = useAuthLoginQuery();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async (formData: FormData) => {
    const loginData = await validateForm(formData);
    if (!loginData) {
      return;
    }
    loginMutation(loginData, {
      onSuccess: () => {
        router.push("/home");
      },
      onError: (error) => {
        console.error("로그인 실패:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    });
  };

  const validateForm = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const validatedData = await loginData.parseAsync({
        email, password,
      });
      setErrors({});
      return validatedData;
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          errors[field] = issue.message;
        });
        setErrors(errors);
      }
      return null;
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleLogin(formData);
    }}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">로그인</h1>
        <div className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              className={cn(
                'w-full p-3 border rounded',
                (errors.email ? 'border-red-400' : '')
              )}
              required
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              className={cn(
                'w-full p-3 border rounded',
                (errors.password ? 'border-red-400' : '')
              )}
              required
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full p-3",
              "bg-blue-600 hover:bg-blue-700 transition-colors",
              "text-white rounded",
              "disabled:opacity-50 disabled:cursor-not-allowed")}
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </div>
    </form>
  )
}