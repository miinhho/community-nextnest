'use client'

import { QueryClient, QueryClientProvider, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query'

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  })

let browserQueryClient: QueryClient | undefined = undefined

export const getQueryClient = () => {
  if (isServer) {
    // 서버 환경에서는 매번 새로운 QueryClient를 생성
    return makeQueryClient()
  } else {
    // 브라우저 환경에서는 싱글턴 패턴을 사용하여 QueryClient를 재사용
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function QueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
