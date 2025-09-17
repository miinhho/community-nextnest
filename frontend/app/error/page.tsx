'use client'

import { errorMessages } from '@/constants/error-page'
import { cn } from '@/lib/utils'
import { redirect, useSearchParams } from 'next/navigation'

type ErrorCode = '403' | '404' | '500' | 'unknown'

export default function ErrorPage() {
  const code = useSearchParams().get('code')
  const errorInfo = errorMessages[code as ErrorCode || 'unknown']

  const handleHomeRedirect = () => {
    redirect('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className={cn(
          "max-w-md w-full p-8 text-center",
          "border rounded-lg border-gray-200",
          "bg-white shadow-sm"
        )}>
          <div className="text-6xl mb-4">
            {errorInfo.icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {errorInfo.description}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleHomeRedirect}
              className={cn(
                "w-full px-4 py-2",
                "border rounded-md border-gray-300 hover:bg-gray-50",
                "text-gray-700 transition-colors"
              )}
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}