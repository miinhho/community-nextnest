'use client'

import { useAuthRegisterQuery } from '@/lib/query/auth.query'
import { cn } from '@/lib/utils'
import { registerData, type RegisterData } from '@/lib/validation/auth.validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function RegisterPage() {
  const router = useRouter()
  const { mutate: registerMutation, error: queryError } = useAuthRegisterQuery()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerData),
  })

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    registerMutation(data, {
      onSuccess: () => {
        router.push('/main')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>
      <div
        className={cn('w-full max-w-md flex flex-col p-6 space-y-4', 'bg-white rounded shadow-md')}
      >
        {queryError && (
          <p className="text-red-600 text-sm mb-4">{queryError.message}</p>
        )}
        <>
          <input
            {...register('name')}
            type="text"
            placeholder="이름"
            className={cn('w-full p-3 border rounded', errors.name ? 'border-red-400' : '')}
            required
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </>
        <>
          <input
            {...register('email')}
            type="email"
            placeholder="이메일"
            className={cn('w-full p-3 border rounded', errors.email ? 'border-red-400' : '')}
            required
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
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
          {isSubmitting ? '회원가입 중...' : '회원가입'}
        </button>
      </div>
    </form>
  )
}
