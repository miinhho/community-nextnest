import { errorMessages } from '@/constants/error-page'
import { redirect } from 'next/navigation'

type ErrorCode = '403' | '404' | '500' | 'unknown'

interface ErrorPageProps {
  searchParams: Promise<{ code?: string }>
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const { code } = await searchParams
  const errorInfo = errorMessages[code as ErrorCode || 'unknown']

  const handleHomeRedirect = () => {
    redirect('/')
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