'use client';

import { useAuthRegisterQuery } from "@/lib/query/auth.query";
import { cn } from "@/lib/utils";
import { registerData } from "@/lib/validation/auth.validate";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ZodError } from "zod/v4";

export default function RegisterPage() {
  const { mutate: registerMutation, isPending } = useAuthRegisterQuery();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async (formData: FormData) => {
    const registerData = await validateForm(formData);
    if (!registerData) {
      return;
    }
    registerMutation(registerData, {
      onSuccess: () => {
        router.push("/home");
      },
      onError: (error) => {
        console.error("회원가입 실패:", error);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    });
  };

  const validateForm = async (formData: FormData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const validatedData = await registerData.parseAsync({
        name, email, password,
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
      handleRegister(formData);
    }}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">회원가입</h1>
        <div className={cn(
          "w-full max-w-md flex flex-col p-6 space-y-4",
          "bg-white rounded shadow-md")}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="이름"
              className={cn(
                'w-full p-3 border rounded',
                (errors.name ? 'border-red-400' : '')
              )}
              required
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
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
          <div>
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
            {isPending ? "회원가입 중..." : "회원가입"}
          </button>
        </div>
      </div>
    </form>
  )
}