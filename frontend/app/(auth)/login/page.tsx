'use client'

import { useAuthLoginQuery } from '@/features/auth/query/auth-login'
import { LoginData, loginData } from '@/features/auth/validation/auth-login'
import { cn } from '@/lib/utils/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function LoginPage() {
  const router = useRouter()
  const { mutate: loginMutation, error: queryError } = useAuthLoginQuery()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginData),
  })

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    loginMutation(data, {
      onSuccess: () => {
        router.push('/main')
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <div className="w-full max-w-md space-y-4">
        {queryError && (
          <p className="text-red-600 text-sm mb-4">{queryError.message}</p>
        )}
        <>
          <input
            {...register('email')}
            type="email"
            placeholder="이메일"
            className={cn('w-full p-3 border rounded', errors.email ? 'border-red-400' : '')}
            required
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </>
        <>
          <input
            {...register('password')}
            type="password"
            placeholder="비밀번호"
            className={cn('w-full p-3 border rounded', errors.password ? 'border-red-400' : '')}
            required
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full p-3',
            'bg-blue-600 hover:bg-blue-700 transition-colors',
            'text-white rounded',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </div>
    </form>
  )
}
