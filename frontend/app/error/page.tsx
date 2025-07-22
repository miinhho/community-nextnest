'use client'

import { errorMessages } from '@/constants/error-page'
import { useQueryState } from 'nuqs'

type ErrorCode = '403' | '404' | '500' | 'unknown'

export default function ErrorPage() {
  const [code] = useQueryState<ErrorCode>('code', {
    defaultValue: 'unknown',
    parse: (value) => {
      if (value !== '403' && value !== '404' && value !== '500') {
        return 'unknown'
      }
      return value as ErrorCode
    },
  })
  const errorInfo = errorMessages[code]

  const handlePreviousRedirect = () => {
    window.history.back()
  }

  const handleHomeRedirect = () => {
    window.location.href = '/'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="text-center bg-white border border-gray-200 rounded-lg p-8 shadow-sm max-w-md w-full">
          <div className="text-6xl mb-4">{errorInfo.icon}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{errorInfo.title}</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{errorInfo.description}</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handlePreviousRedirect}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              이전 페이지로 돌아가기
            </button>
            <button
              onClick={handleHomeRedirect}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
